// Bubble Sort Visualization using D3.js

// ---------- Global State ----------
let data = [];           // array of numbers to sort
let isPlaying = false;   // autoplay flag
let speed = 500;         // delay in ms between steps
let i = 0;               // outer loop index
let j = 0;               // inner loop index
let timer = null;        // timeout id for autoplay

const svgHeight = 300;   // constant SVG height
let svg;                 // global svg selection

// Utility: wait for a given time
const wait = ms => new Promise(res => setTimeout(res, ms));

// Generate a new random dataset and draw bars
function init() {
  data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 91) + 10);
  i = 0;
  j = 0;
  isPlaying = false;

  // Create/recreate the SVG container
  d3.select('#chart').selectAll('*').remove();
  svg = d3.select('#chart').append('svg')
    .attr('viewBox', `0 0 ${data.length * 20} ${svgHeight}`);

  drawBars();
}

// Draw the bars based on current data
function drawBars(animate = false) {
  const barWidth = 20;
  const bars = svg.selectAll('rect')
    .data(data);

  bars.enter()
    .append('rect')
    .attr('x', (d, idx) => idx * barWidth)
    .attr('width', barWidth - 2)
    .attr('y', svgHeight)
    .attr('height', 0)
    .attr('fill', 'rgb(168 219 168)')
    .transition()
    .duration(animate ? speed : 0)
    .attr('y', d => svgHeight - d * 3)
    .attr('height', d => d * 3);

  bars
    .transition()
    .duration(animate ? speed : 0)
    .attr('x', (d, idx) => idx * barWidth)
    .attr('y', d => svgHeight - d * 3)
    .attr('height', d => d * 3)
    .attr('fill', 'rgb(168 219 168)');
}

// Execute one comparison/swap step
async function bubbleSortStep() {
  // Stop if sorted
  if (i >= data.length - 1) return;

  const bars = svg.selectAll('rect');

  // Highlight the bars being compared
  bars.filter((d, idx) => idx === j || idx === j + 1)
    .attr('fill', 'orange');
  await wait(speed);

  // Swap if needed and animate the height change
  if (data[j] > data[j + 1]) {
    [data[j], data[j + 1]] = [data[j + 1], data[j]];
    svg.selectAll('rect')
      .data(data)
      .transition()
      .duration(speed)
      .attr('y', d => svgHeight - d * 3)
      .attr('height', d => d * 3);
    await wait(speed);
  }

  // Reset colors
  bars.attr('fill', 'rgb(168 219 168)');

  // Increment indices
  j++;
  if (j >= data.length - i - 1) {
    j = 0;
    i++;
  }
}

// Autoplay loop using recursive timeouts
function autoStep() {
  timer = setTimeout(async () => {
    if (!isPlaying || i >= data.length - 1) {
      isPlaying = false;
      clearTimeout(timer);
      timer = null;
      return;
    }
    await bubbleSortStep();
    autoStep();
  }, 0);
}

// Control handlers
window.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('play');
  const nextBtn = document.getElementById('next');
  const resetBtn = document.getElementById('reset');
  const speedSlider = document.getElementById('speed');

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      isPlaying = false;
      playBtn.textContent = 'Play';
      clearTimeout(timer);
    } else {
      isPlaying = true;
      playBtn.textContent = 'Pause';
      autoStep();
    }
  });

  nextBtn.addEventListener('click', async () => {
    if (!isPlaying) await bubbleSortStep();
  });

  resetBtn.addEventListener('click', () => {
    clearTimeout(timer);
    init();
    playBtn.textContent = 'Play';
  });

  speedSlider.addEventListener('input', e => {
    speed = +e.target.value;
    if (isPlaying) {
      clearTimeout(timer);
      autoStep();
    }
  });

  init();
});

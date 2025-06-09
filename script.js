// Bubble Sort Visualization using D3.js

// Global state
let data = [];
let isPlaying = false;
let speed = 500; // milliseconds
let i = 0;
let j = 0;

const svgHeight = 300;
let svg;

// Utility to wait for a given time
const wait = ms => new Promise(res => setTimeout(res, ms));

// Generate random array and draw bars
function init() {
  data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 91) + 10);
  i = 0; j = 0; isPlaying = false;

  d3.select('#chart').selectAll('*').remove();
  svg = d3.select('#chart').append('svg')
    .attr('viewBox', `0 0 ${data.length * 20} ${svgHeight}`);

  drawBars();
}

// Draw the bars based on current data
function drawBars() {
  const barWidth = 20;
  svg.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d, idx) => idx * barWidth)
    .attr('y', d => svgHeight - d * 3)
    .attr('width', barWidth - 2)
    .attr('height', d => d * 3)
    .attr('fill', 'rgb(168 219 168)'); // sage-green
}

// Single bubble sort step
async function bubbleSortStep() {
  if (i >= data.length - 1) return; // already sorted

  // Highlight compared bars
  d3.select(svg.children()[j]).attr('fill', 'orange');
  d3.select(svg.children()[j + 1]).attr('fill', 'orange');
  await wait(speed);

  if (data[j] > data[j + 1]) {
    // Swap values
    [data[j], data[j + 1]] = [data[j + 1], data[j]];
    drawBars();
  }

  // Reset colors
  d3.select(svg.children()[j]).attr('fill', 'rgb(168 219 168)');
  d3.select(svg.children()[j + 1]).attr('fill', 'rgb(168 219 168)');

  j++;
  if (j >= data.length - i - 1) {
    j = 0;
    i++;
  }
}

// Play loop
async function play() {
  if (isPlaying) return;
  isPlaying = true;
  while (isPlaying && i < data.length - 1) {
    await bubbleSortStep();
    await wait(speed);
  }
  isPlaying = false;
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
    } else {
      playBtn.textContent = 'Pause';
      play();
    }
  });

  nextBtn.addEventListener('click', async () => {
    if (!isPlaying) await bubbleSortStep();
  });

  resetBtn.addEventListener('click', () => {
    init();
    playBtn.textContent = 'Play';
  });

  speedSlider.addEventListener('input', e => {
    speed = +e.target.value;
  });

  init();
});

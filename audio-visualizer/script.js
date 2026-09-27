let audio1 = new Audio();
audio1.src = "demo.mp3";

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let analyser = null;

const controls = document.getElementById("musicControls");
const playButton = controls.querySelector("button");
const fileInput = document.getElementById("upload");

// Handle custom audio file upload
fileInput.addEventListener("change", (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  const file = files[0];
  // Set the audio element source to the blob URL of the uploaded file
  audio1.src = URL.createObjectURL(file);
  
  // Reset play button state and play uploaded audio automatically
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  
  audio1.play();
  playButton.dataset.action = "pause";
  playButton.textContent = "Pause";
});

// Reset play button to default state when the audio finishes
audio1.addEventListener("ended", () => {
  playButton.dataset.action = "play";
  playButton.textContent = "Play";
});

// Listen for play/pause toggle button clicks
controls.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") return;

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const action = event.target.dataset.action;

  switch (action) {
    case "play":
      audio1.play();
      event.target.dataset.action = "pause";
      event.target.textContent = "Pause";
      break;
    case "pause":
      audio1.pause();
      event.target.dataset.action = "play";
      event.target.textContent = "Play";
      break;
  }
});

audioSource = audioCtx.createMediaElementSource(audio1);
analyser = audioCtx.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 128;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function average(data) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i];
  }
  return total / data.length;
}

let time = 0;

function background() {
  ctx.fillStyle = `rgba(255, 255, 255, ${average(dataArray) / 5000})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function simpleBars(yOffset = 0) {
  const barWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    ctx.fillStyle = `rgb(${x}, ${255 - x}, ${barHeight})`;
    ctx.fillRect(x, (canvas.height - barHeight) / 2 + yOffset, barWidth, barHeight);
    x += barWidth;
  }
}

function sphere() {
  let modifiedTime = time;
  while (modifiedTime > 500) {
    modifiedTime -= 500;
  }

  const size = average(dataArray) + 100;
  const x = Math.sin(100 - size / 5) * 100 * 2 + canvas.width / 2;
  const y = Math.cos(100 - size / 5) * 100 * 2 + canvas.height / 2;

  ctx.fillStyle = "white";

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  analyser.getByteFrequencyData(dataArray);
  time += 1;

  background();
  simpleBars(canvas.height / -3);
  simpleBars(canvas.height / 3);
  sphere();
  simpleBars();

  requestAnimationFrame(animate);
}

animate();

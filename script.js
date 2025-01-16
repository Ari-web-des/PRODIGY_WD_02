// script.js
let startTime = 0;
let elapsedTime = 0;
let intervalId = null;
let isRunning = false;
let lapCounter = 0;


const display = document.getElementById("display");
const startPauseBtn = document.getElementById("startPauseBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapList = document.getElementById("lapList");
const noteList = document.getElementById("noteList")

startPauseBtn.addEventListener("click", toggleStartPause);
lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetStopwatch);

function toggleStartPause() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime; // Adjust start time for resumed stopwatch
    intervalId = setInterval(updateTime, 10); // Update every 10ms for smooth display
    startPauseBtn.textContent = "Pause";
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  } else {
    clearInterval(intervalId);
    elapsedTime = Date.now() - startTime; // Save elapsed time
    startPauseBtn.textContent = "Start";
  }
  isRunning = !isRunning;
}

function updateTime() {
  elapsedTime = Date.now() - startTime;
  display.textContent = formatTime(elapsedTime);
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  const formattedMilliseconds = String(milliseconds).padStart(3, "0");

  return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function recordLap() {
    lapCounter += 1;
    const lapTime = formatTime(elapsedTime);
  
    // Add lap time to the lap list
    const lapItem = document.createElement("li");
    lapItem.textContent = `Lap ${lapCounter}: ${lapTime}`;
    lapList.appendChild(lapItem);
  
    // Add a note section for this lap
    const noteItem = document.createElement("li");
    noteItem.innerHTML = `
      <div class="note-header">Lap ${lapCounter} Notes</div>
      <textarea class="note-input" placeholder="Add your notes here..."></textarea>
    `;
    noteList.appendChild(noteItem);
  }
function resetStopwatch() {
  clearInterval(intervalId);
  isRunning = false;
  elapsedTime = 0;
  lapCounter = 0;
  startPauseBtn.textContent = "Start";
  display.textContent = "00:00.000";
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  lapList.innerHTML = "";
  noteList.innerHTML = "";
}
const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", exportToFile);

function exportToFile() {
  const laps = Array.from(document.querySelectorAll("#lapList li"));
  const notes = Array.from(document.querySelectorAll(".note-input"));

  if (laps.length === 0) {
    alert("No data to export!");
    return;
  }

  let fileContent = "Lap Number, Time, Notes\n"; // CSV header

  laps.forEach((lap, index) => {
    const lapTime = lap.textContent;
    const note = notes[index]?.value || "No Notes";
    fileContent += `${index + 1}, ${lapTime}, "${note}"\n`;
  });

  // Create a Blob for the file content
  const blob = new Blob([fileContent], { type: "text/csv" });

  // Create a download link
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stopwatch_data.csv";

  // Trigger the download
  a.click();

  // Clean up
  URL.revokeObjectURL(a.href);
}



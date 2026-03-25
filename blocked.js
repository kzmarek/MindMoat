// 1. Grab the "?reason=" part of the URL
const urlParams = new URLSearchParams(window.location.search);
const reason = urlParams.get('reason');

// 2. Find the HTML elements we want to change
const titleEl = document.getElementById('blockTitle');
const messageEl = document.getElementById('blockMessage');
const iconEl = document.getElementById('blockIcon');

// 3. Change the text based on the reason
if (reason === 'focus') {
  titleEl.textContent = "Focus Mode Active";
  messageEl.textContent = "This site is blocked because you manually activated Focus Mode. Get back to work!";
  titleEl.style.color = "#2e7d32"; // Green for productivity!
  iconEl.textContent = "🧠";
} else if (reason === 'limit') {
  titleEl.textContent = "Time's Up!";
  messageEl.textContent = "You have exceeded your daily time allowance for distracting sites. Time to log off!";
  titleEl.style.color = "#d32f2f"; // Red for stop!
  iconEl.textContent = "⏳";
}
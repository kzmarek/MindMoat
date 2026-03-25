# MindMoat (Chrome Site Blocker)

A privacy-first, lightweight Chrome extension designed to help you regain control of your time. It combines a daily browsing allowance with an on-demand "Focus Mode" to keep distracting sites at bay.

## Features
- **Daily Allowance:** Set a daily time limit (e.g., 60 minutes) for distracting websites. Once the time is up, the sites are blocked.
- **Focus Mode:** Instantly block all listed sites with one click when you need to do deep work.
- **Tracker Toggle:** Need to watch a tutorial on a blocked site for work? Pause the tracker so it doesn't eat into your daily leisure budget.
- **100% Private:** No tracking, no analytics, no external servers. All settings and timers are stored entirely locally on your machine using `chrome.storage.local`.

## Installation (Local / Developer Mode)
To install this extension directly from the source code:

1. Download or clone this repository to your computer.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Toggle **Developer mode** ON (top right corner).
4. Click **Load unpacked** (top left).
5. Select the folder containing the extension files.
6. Click the puzzle piece icon in your Chrome toolbar and pin the extension for easy access!

## How to Use
1. Open the extension popup.
2. Click **Settings** to add URLs to your blocklist (one per line) and set your daily limit in minutes.
3. Browse normally. The timer will count down while you are actively on those sites.
4. Click **Start Focus Mode** if you want to block the sites immediately, regardless of how much daily time you have left.

## Acknowledgments
- Built using vanilla HTML, CSS, and JavaScript with Chrome Manifest V3 APIs.
- Developed with the assistance of AI as a coding copilot.

## License
This project is licensed under the MIT License.
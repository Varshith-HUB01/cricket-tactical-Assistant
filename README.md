# Cricket Tactical Assistant 🏏 

An AI-powered Chrome Extension that serves as a real-time tactical commentator. By capturing live frames from YouTube cricket streams, this tool leverages Google's Gemini Vision API to instantly analyze the on-screen matchup, identify player weaknesses, and suggest strategic field placements—all without interrupting the video.

## Features

* **Real-Time Frame Analysis:** Captures video frames directly from the browser using the HTML5 Canvas API and `MutationObserver`.
* **AI Strategy Engine:** Utilizes Google Gemini Vision to read the on-screen scoreboard, identify the Striker and Bowler, and generate custom tactical insights.
* **Premium 'Liquid Glass' UI:** Features a sleek, non-intrusive Crimson & Gold matchday aesthetic that floats directly over the YouTube video player.
* **Cloud-Native Backend:** Powered by a blazing-fast Python/FastAPI server designed for seamless serverless deployment.
* **Monorepo Structure:** Clean separation of concerns with independent frontend and backend directories.


 How to Get Started
Follow these steps to set up the Cricket Tactical Assistant on your browser:
1. Get the Backend Ready (Cloud Setup)
Sign up: Create a free account on Vercel.
Import: Connect your GitHub account and import your copy of this repository.
Configure: In the Vercel project settings, set the Root Directory to cricket-ai-backend and the framework preset to FastAPI.
Deploy: Click Deploy and copy the live URL provided by Vercel once it finishes.
2. Prepare the Chrome Extension
Download: Clone this repository to your local computer.
Update: Open the content.js file located in the Cricket-ai-extension folder.
Link: Find the fetch URL in the code and replace it with your own live Vercel URL (make sure it ends with /analyze-frame).
3. Install in Chrome
Developer Mode: Open Chrome, go to chrome://extensions/, and toggle the Developer mode switch in the top-right corner.
Load: Click the Load unpacked button and select the Cricket-ai-extension folder from your computer.
Connect AI: Click the extension icon in your browser toolbar, open the Options page, and enter your Google Gemini API key.
4. Enjoy
Refresh any YouTube page playing a cricket match, and the tactical UI will automatically appear over the video.

# Cricket Tactical Assistant 🏏 

An AI-powered Chrome Extension that serves as a real-time tactical commentator. By capturing live frames from YouTube cricket streams, this tool leverages Google's Gemini Vision API to instantly analyze the on-screen matchup, identify player weaknesses, and suggest strategic field placements—all without interrupting the video.

## Features

* **Real-Time Frame Analysis:** Captures video frames directly from the browser using the HTML5 Canvas API and `MutationObserver`.
* **AI Strategy Engine:** Utilizes Google Gemini Vision to read the on-screen scoreboard, identify the Striker and Bowler, and generate custom tactical insights.
* **Premium 'Liquid Glass' UI:** Features a sleek, non-intrusive Crimson & Gold matchday aesthetic that floats directly over the YouTube video player.
* **Cloud-Native Backend:** Powered by a blazing-fast Python/FastAPI server designed for seamless serverless deployment.
* **Monorepo Structure:** Clean separation of concerns with independent frontend and backend directories.



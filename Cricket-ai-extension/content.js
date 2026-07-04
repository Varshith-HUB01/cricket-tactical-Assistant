// content.js
console.log("Visual Cricket AI Agent Initialized.");

let isMinimized = false;

const observer = new MutationObserver((mutations, obs) => {
  const video = document.querySelector('video');
  if (video) {
    createCompactUI(video);
    captureVideoFrame(); // Runs once when the video first loads
    obs.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

function createCompactUI(videoElement) {
  const container = videoElement.parentElement;

  const panel = document.createElement('div');
  panel.id = 'cricket-ai-compact-panel';
  
  // Base Layout
  panel.style.position = 'absolute';
  panel.style.top = '20px';
  panel.style.left = '20px';
  panel.style.width = '280px';
  
  // Liquid Glass Core Properties (Crimson & Gold Matchday Palette)
  panel.style.background = 'rgba(43, 0, 0, 0.35)'; 
  panel.style.backdropFilter = 'blur(16px) saturate(180%)';
  panel.style.WebkitBackdropFilter = 'blur(16px) saturate(180%)'; // Ensure Safari support
  
  // Refraction and Borders
  panel.style.border = '1px solid rgba(212, 175, 55, 0.3)';
  panel.style.borderRadius = '16px'; 
  panel.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 rgba(212, 175, 55, 0.15)';
  
  // Typography & UI Configuration
  panel.style.color = '#f8fafc';
  panel.style.padding = '16px'; 
  panel.style.zIndex = '9999';
  panel.style.fontFamily = 'system-ui, sans-serif';
  panel.style.fontSize = '12px';
  panel.style.transition = 'width 0.2s ease, height 0.2s ease';

  panel.innerHTML = `
    <div id="cricket-ai-drag-handle" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 4px; margin-bottom: 6px; cursor: move; user-select: none;">
      <span style="font-weight: bold; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.05em; pointer-events: none;">Matchup Agent</span>
      <div>
        <button id="cricket-ai-refresh-btn" style="background: none; border: none; color: #38bdf8; cursor: pointer; font-size: 11px; font-weight: bold; padding: 0 8px; text-transform: uppercase;">Refresh</button>
        <button id="cricket-ai-min-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 14px; font-weight: bold; padding: 0 4px;">_</button>
      </div>
    </div>
    <div id="cricket-ai-content">Analyzing scoreboard...</div>
  `;

  container.appendChild(panel);

  // --- REFRESH LOGIC ---
  document.getElementById('cricket-ai-refresh-btn').onclick = (e) => {
    e.stopPropagation(); // Prevents dragging when clicking the button
    const content = document.getElementById('cricket-ai-content');
    if (!isMinimized) {
      content.innerHTML = `<span style="color: #94a3b8;">Analyzing current frame...</span>`;
    }
    captureVideoFrame();
  };

  // --- MINIMIZE/EXPAND LOGIC ---
  document.getElementById('cricket-ai-min-btn').onclick = (e) => {
    e.stopPropagation(); 
    const content = document.getElementById('cricket-ai-content');
    isMinimized = !isMinimized;
    
    if (isMinimized) {
      content.style.display = 'none';
      panel.style.width = '140px';
      document.getElementById('cricket-ai-min-btn').innerText = '▢';
    } else {
      content.style.display = 'block';
      panel.style.width = '280px';
      document.getElementById('cricket-ai-min-btn').innerText = '_';
    }
  };

  // --- DRAGGABLE MOUSE EVENTS HANDLING ---
  const handle = document.getElementById('cricket-ai-drag-handle');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    // Update the active drag color to complement the red background
    handle.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    const maxLeft = container.clientWidth - panel.clientWidth;
    const maxTop = container.clientHeight - panel.clientHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    panel.style.left = `${newLeft}px`;
    panel.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      handle.style.backgroundColor = 'transparent';
    }
  });
}

function captureVideoFrame() {
  const video = document.querySelector('video');
  if (!video || video.readyState < 2) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth / 2;
  canvas.height = video.videoHeight / 2;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
  sendFrameToBackend(base64Image);
}

function sendFrameToBackend(base64Data) {
  const contentDiv = document.getElementById('cricket-ai-content');
  if (!contentDiv || isMinimized) return;

  // Retrieve the user's API key from Chrome storage
  chrome.storage.local.get(['geminiApiKey'], async (result) => {
    const apiKey = result.geminiApiKey;
    
    // Check if the user has entered a key yet
    if (!apiKey) {
      contentDiv.innerHTML = `<span style="color: #fb923c;">Missing API Key. Right-click the extension icon and select 'Options' to add it.</span>`;
      return;
    }

    try {
      console.log("Sending frame to backend...");
      const response = await fetch('https://cricket-tactical-assistant.vercel.app/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data, api_key: apiKey })
    });
      
      if (!response.ok) {
        contentDiv.innerHTML = `<span style="color: #f87171;">Server error (${response.status}). Rate limit exceeded or invalid key.</span>`;
        return;
      }
      
      const data = await response.json();
      if (data.error) {
        contentDiv.innerHTML = `<span style="color: #f87171;">Engine error: ${data.error}</span>`;
        return;
      }

      contentDiv.innerHTML = `
        <div style="margin-bottom: 6px;">
          <span style="color: #38bdf8; font-weight: bold;">Striker: ${data.batsman1.name}</span>
          <div style="color: #cbd5e1; font-size: 11px; margin-top: 1px;"><b>Weakness:</b> ${data.batsman1.weakness}</div>
        </div>
        <div style="margin-bottom: 6px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
          <span style="color: #fb923c; font-weight: bold;">Bowler: ${data.bowler.name}</span>
          <div style="color: #cbd5e1; font-size: 11px; margin-top: 1px;"><b>Strategy:</b> ${data.bowler.strategy}</div>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; background: rgba(0, 0, 0, 0.2); padding: 4px; border-radius: 4px; font-size: 11px; color: #4ade80;">
          <b>Recommended Field:</b> ${data.field_placement}
        </div>
      `;
    } catch (err) {
      console.error("Fetch failed:", err);
      contentDiv.innerHTML = `<span style="color: #f87171;">Fetch failed. Ensure backend is accessible.</span>`;
    }
  });
}
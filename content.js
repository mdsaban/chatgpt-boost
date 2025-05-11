function attachMonitor() {
  const configScript = document.createElement("script");
  configScript.src = chrome.runtime.getURL("monitor-config.js");
  configScript.onload = function () {
    this.remove();

    // Load XHR Monitor
    const xhrScript = document.createElement("script");
    xhrScript.src = chrome.runtime.getURL("xhr-monitor.js");
    xhrScript.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(xhrScript);

    // Load Fetch Monitor
    const fetchScript = document.createElement("script");
    fetchScript.src = chrome.runtime.getURL("fetch-monitor.js");
    fetchScript.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(fetchScript);
  };
  (document.head || document.documentElement).appendChild(configScript);
}

function createToggleButton() {
  const button = document.createElement("button");
  button.classList.add("chatgpt-api-monitor-toggle");
  button.innerHTML = "Show Messages";
  button.style.position = "fixed";
  button.style.top = "70px";
  button.style.right = "10px";
  button.style.padding = "8px 16px";
  button.style.backgroundColor = "black";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.zIndex = "1000";
  button.style.display = "block";
  button.style.fontSize = "14px";
  button.onclick = toggleMonitor;
  document.body.appendChild(button);
  
  // Make button draggable
  makeDraggable(button);
  
  return button;
}

function toggleMonitor() {
  const monitorDiv = document.querySelector(".chatgpt-api-monitor");
  const toggleButton = document.querySelector(".chatgpt-api-monitor-toggle");
  
  if (monitorDiv) {
    const isVisible = monitorDiv.style.display !== "none";
    monitorDiv.style.display = isVisible ? "none" : "block";
    toggleButton.style.display = isVisible ? "block" : "none";
  }
}

function createMonitorDiv() {
  const div = document.createElement("div");
  // add a class to the div
  div.classList.add("chatgpt-api-monitor");
  
  // Create close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.style.border = "none";
  closeButton.style.background = "transparent";
  closeButton.style.fontSize = "20px";
  closeButton.style.cursor = "pointer";
  closeButton.style.padding = "0 5px";
  closeButton.onclick = toggleMonitor;
  
  // Create draggable header
  const dragHandle = document.createElement("div");
  dragHandle.style.paddingBottom = "5px";
  dragHandle.style.marginBottom = "5px";
  dragHandle.style.cursor = "move";
  dragHandle.style.fontSize = "14px";
  dragHandle.style.fontWeight = "600";
  dragHandle.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
  dragHandle.innerHTML = "User Messages";
  
  // Create content wrapper
  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("content-wrapper");
  contentWrapper.innerHTML = '<div style="margin: 0 0 10px 0;">Loading...</div>';
  
  // add a style to the div
  div.style.position = "fixed";
  div.style.top = "70px";
  div.style.right = "10px";
  div.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
  div.style.backdropFilter = "blur(10px)";
  div.style.webkitBackdropFilter = "blur(10px)";
  div.style.padding = "10px";
  div.style.paddingBottom = "30px";
  div.style.zIndex = "1000";
  div.style.border = "1px solid rgb(49, 49, 49)";
  div.style.borderRadius = "5px";
  div.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  div.style.maxWidth = "360px";
  div.style.minWidth = "360px";
  div.style.fontSize = "14px";
  div.style.fontFamily = "system-ui, -apple-system, sans-serif";
  div.style.display = "none";

  // Create report issue link
  const reportLink = document.createElement("a");
  reportLink.href = "https://github.com/mdsaban/chatgpt-boost/issues/new";
  reportLink.target = "_blank";
  reportLink.innerHTML = "Report an issue";
  reportLink.style.position = "absolute";
  reportLink.style.bottom = "0";
  reportLink.style.right = "4px";
  reportLink.style.padding = "4px";
  reportLink.style.textAlign = "right";
  reportLink.style.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
  reportLink.style.width = "100%";
  
  div.appendChild(closeButton);
  div.appendChild(dragHandle);
  div.appendChild(contentWrapper);
  div.appendChild(reportLink);
  document.body.appendChild(div);
  
  // Make div draggable
  makeDraggable(div, dragHandle);
}

// Function to make an element draggable
function makeDraggable(element, dragHandle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  if (dragHandle) {
    // If present, the dragHandle is where you move the element from
    dragHandle.onmousedown = dragMouseDown;
  } else {
    // Otherwise, move the element from anywhere inside it
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Set the element's new position
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
    element.style.right = "auto"; // Remove the right position so it doesn't conflict
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

attachMonitor();

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    createMonitorDiv();
    createToggleButton();
  }, 2000);
});

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
  
  // Create content wrapper
  const contentWrapper = document.createElement("div");
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
  div.style.maxHeight = "400px";
  div.style.overflow = "auto";
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
  reportLink.style.right = "0";
  reportLink.style.padding = "4px";
  reportLink.style.textAlign = "right";
  reportLink.style.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
  reportLink.style.width = "100%";
  
  div.appendChild(closeButton);
  div.appendChild(contentWrapper);
  div.appendChild(reportLink);
  document.body.appendChild(div);
}

attachMonitor();

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    createMonitorDiv();
    createToggleButton();
  }, 2000);
});

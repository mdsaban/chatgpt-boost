// xhr-monitor.js
(function() {
    const OriginalXMLHttpRequest = window.XMLHttpRequest;
  
    window.XMLHttpRequest = function() {
      const xhr = new OriginalXMLHttpRequest();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;
      let requestUrl = '';
  
      xhr.open = function(...args) {
        const [, url] = args;
        requestUrl = url;
        return originalOpen.apply(this, args);
      };
  
      xhr.send = function(data) {
        // Use shared configuration
        const monitorConfig = window.__CHATGPT_MONITOR_CONFIG;
        const shouldLog = monitorConfig && monitorConfig.shouldLogRequest(requestUrl);

        if (shouldLog) {
          xhr.addEventListener('load', function() {
            try {
              let responseData;
              if (xhr.responseType === 'json') {
                responseData = xhr.response;
              } else if (xhr.responseType === '' || xhr.responseType === 'text') {
                const responseText = xhr.responseText;
                try {
                  responseData = JSON.parse(responseText);
                } catch {
                  responseData = responseText;
                }
              } else if (xhr.response) {
                responseData = xhr.response;
              }
              
              if (responseData) {
                monitorConfig.logResponse(requestUrl, responseData);
              }
            } catch (e) {
              console.error('Error reading response:', e.message);
            }
          });
        }
  
        return originalSend.apply(this, arguments);
      };
  
      return xhr;
    };
})();
  
(function() {
  const originalFetch = window.fetch;

  window.fetch = async function(...args) {
    const [resource, config] = args;
    const url = resource instanceof Request ? resource.url : resource;
    
    // Use shared configuration
    const monitorConfig = window.__CHATGPT_MONITOR_CONFIG;
    const shouldLog = monitorConfig && monitorConfig.shouldLogRequest(url);

    try {
      const response = await originalFetch.apply(this, args);
      
      if (shouldLog) {
        const clone = response.clone();
        clone.text().then(body => {
          try {
            const responseData = JSON.parse(body);
            monitorConfig.logResponse(url, responseData);
          } catch {
            monitorConfig.logResponse(url, body);
          }
        }).catch(err => console.error('Error reading response:', err.message));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
})(); 
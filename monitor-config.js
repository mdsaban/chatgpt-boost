// Monitor configuration that will be injected into the page
window.__CHATGPT_MONITOR_RESPONSE = {};
window.__CHATGPT_MONITOR_CONFIG = {
  apiPattern: /https:\/\/chatgpt\.com\/backend-api\/conversation\/[0-9a-f-]+$/,
  shouldLogRequest: function(url) {
    return this.apiPattern.test(url);
  },
  filterUserMessages: function(mapping) {
    const userMessages = {};
    for (const [id, node] of Object.entries(mapping)) {
      if (node.message && node.message.author && node.message.author.role === 'user') {
        if(node?.message?.content?.parts?.[0]) {
          userMessages[id] = node.message.content.parts[0];
        }
      }
    }
    return userMessages;
  },
  scrollToMessage: function(messageId) {
    const targetElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  updateMonitorDiv: function(retryCount = 0) {
    const response = window.__CHATGPT_MONITOR_RESPONSE;
    const monitorDiv = document.querySelector('.chatgpt-api-monitor');
    const userMessages = this.filterUserMessages(response.mapping);
    if (monitorDiv && response.mapping) {
      // Find or create content wrapper
      let contentWrapper = monitorDiv.querySelector('.content-wrapper');
      if (!contentWrapper) {
        contentWrapper = monitorDiv.children[1]; // Second child after close button
      }
      
      // Clear previous content
      contentWrapper.innerHTML = '';
      
      // Add full mapping section
      const fullMappingSection = document.createElement('div');
      fullMappingSection.innerHTML = '<div style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">User Messages:</div>';

      // Add a style to the fullMappingSection
      fullMappingSection.style.overflow = 'auto';
      fullMappingSection.style.maxHeight = '360px';

      Object.entries(userMessages).forEach(([id, message]) => {
        const messageDiv = document.createElement('div');
        messageDiv.style.marginBottom = '4px';
        messageDiv.style.padding = '4px';
        
        const idButton = document.createElement('button');
        idButton.innerHTML = message
        idButton.style.cursor = 'pointer';
        idButton.style.border = 'none';
        idButton.style.padding = '4px 0';
        idButton.style.textAlign = 'left';
        idButton.style.width = '100%';
        idButton.style.borderBottom = '1px solid #e1e1e1';
        idButton.style.fontSize = '14px';
        idButton.style.display = '-webkit-box';
        idButton.style.webkitLineClamp = '2';
        idButton.style.webkitBoxOrient = 'vertical';
        idButton.style.overflow = 'hidden';
        idButton.style.textOverflow = 'ellipsis';
        idButton.style.background = 'transparent';
        idButton.style.color = 'inherit';
        
        idButton.onclick = () => this.scrollToMessage(id);
        
        messageDiv.appendChild(idButton);
        fullMappingSection.appendChild(messageDiv);
      });

      contentWrapper.appendChild(fullMappingSection);
    } else if (retryCount < 5) {
      console.log(`Monitor div not found, retrying... (${retryCount + 1}/5)`);
      setTimeout(() => {
        this.updateMonitorDiv(retryCount + 1);
      }, 2000);
    } else {
      console.warn('Failed to find monitor div after 5 retries');
    }
  },
  logResponse: function(url, response) {
    console.log('[ChatGPT API Response]:', {
      url: url,
      data: response
    });
    
    window.__CHATGPT_MONITOR_RESPONSE = response;
    // Start the retry process for updating the monitor div
    this.updateMonitorDiv(0);
  }
}; 
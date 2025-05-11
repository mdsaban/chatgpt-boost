// Monitor configuration that will be injected into the page
window.__CHATGPT_MONITOR_RESPONSE = {};
window.__CHATGPT_MONITOR_REQUEST = [];
window.__CHATGPT_USER_MESSAGES = {};
window.__CHATGPT_MONITOR_CONFIG = {
  apiPattern: /^https:\/\/chatgpt\.com\/backend-api(?:\/[^\/]*)?\/conversation(?:\/[0-9a-f-]+)?$/,
  shouldLogRequest: function(url) {
    console.log(url, this.apiPattern.test(url))

    return this.apiPattern.test(url);
  },
  filterUserMessages: function() {
    const mapping = window.__CHATGPT_MONITOR_RESPONSE.mapping;
    if(!mapping) return {};
    for (const [id, node] of Object.entries(mapping)) {
      if (node.message && node.message.author && node.message.author.role === 'user') {
        if(node?.message?.content?.parts?.[0]) {
          window.__CHATGPT_USER_MESSAGES[id] = node.message.content.parts[0];
        }
      }
    }
    return window.__CHATGPT_USER_MESSAGES;
  },
  addUserPostRequests: function() {
    const requests = window.__CHATGPT_MONITOR_REQUEST
    for(const request of requests) {
      const messageId = request.messages[0].id;
      const message = request.messages[0].content.parts[0];
      window.__CHATGPT_USER_MESSAGES[messageId] = message;
    }
    return window.__CHATGPT_USER_MESSAGES;
  },
  scrollToMessage: function(messageId) {
    const targetElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },
  updateMonitorDiv: function(retryCount = 0) {
    const monitorDiv = document.querySelector('.chatgpt-api-monitor');
    let userMessages = this.filterUserMessages();
    userMessages = this.addUserPostRequests();
    if (monitorDiv && Object.keys(userMessages).length > 0) {
      // Find or create content wrapper
      let contentWrapper = monitorDiv.querySelector('.content-wrapper');
      if (!contentWrapper) {
        contentWrapper = monitorDiv.children[1]; // Second child after close button
      }
      
      // Clear previous content
      contentWrapper.innerHTML = '';
      
      // Add full mapping section
      const fullMappingSection = document.createElement('div');

      // Add a style to the fullMappingSection
      fullMappingSection.style.overflow = 'auto';
      fullMappingSection.style.maxHeight = '360px';

      // Check if we have user messages
      if (Object.keys(userMessages).length === 0) {
        fullMappingSection.innerHTML += '<div style="margin: 10px 0;">No messages yet. Start a conversation with ChatGPT to see messages here.</div>';
      } else {
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
          idButton.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
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
      }

      contentWrapper.appendChild(fullMappingSection);
      
      // Scroll to the bottom to show the latest messages
      fullMappingSection.scrollTop = fullMappingSection.scrollHeight;
    } else if (retryCount < 5) {
      setTimeout(() => {
        this.updateMonitorDiv(retryCount + 1);
      }, 2000);
    }
  },
  logResponse: function(url, response, request) {
    console.log(url, response, request)
    if(typeof response === 'object') {
      window.__CHATGPT_MONITOR_RESPONSE = response;
      window.__CHATGPT_MONITOR_REQUEST= []
      window.__CHATGPT_USER_MESSAGES = {}
    }

    // POST request for delete chat or new wchat
    const isDeleteChat = request && request?.is_visible === false
    const isNewChat = request && !request.conversation_id
    if(isDeleteChat || isNewChat) {
      window.__CHATGPT_MONITOR_RESPONSE = {}
      window.__CHATGPT_MONITOR_REQUEST= []
      window.__CHATGPT_USER_MESSAGES = {}
      if(isDeleteChat) return 
    }
    // POST request for new chat
    if(request) {
      window.__CHATGPT_MONITOR_REQUEST.push(request);
    }
    // Start the retry process for updating the monitor div
    this.updateMonitorDiv(0);
  }
}; 
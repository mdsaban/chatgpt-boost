const selector = '[data-message-author-role="user"]';
const flagIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>'
const outlineIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-90 w-4"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>`
const loadingAnim = `
<svg class="w-10" version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
  viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
  <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite"
      begin="0.1"/>    
  </circle>
  <circle fill="#fff" stroke="none" cx="26" cy="50" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite" 
      begin="0.2"/>       
  </circle>
  <circle fill="#fff" stroke="none" cx="46" cy="50" r="6">
    <animate
      attributeName="opacity"
      dur="1s"
      values="0;1;0"
      repeatCount="indefinite" 
      begin="0.3"/>     
  </circle>
</svg>
`
function fetchText(selector) {
  const elements = document.querySelectorAll(selector);
  const elemWithText = [];
  for (let element of elements) {
    const uuid = Math.random().toString(36).substring(7);
    element.id = uuid;
    if (element.innerText) {
      elemWithText.push({ [uuid]: element.innerText.replace(/\s+/g, " ") });
    }
  }
  return elemWithText;
}

function addElement() {
  const messageOutline = document.getElementById("message-outline");
  if (messageOutline) {
    messageOutline.remove();
  }
  const div = document.createElement("div");
  div.id = "message-outline";
  document.querySelector("#__next > div").appendChild(div);

    // add tailwind class so that this element enters with a little transition from right of the screen to left
  let classList =
    "flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary px-3 w-64 relative";
  div.setAttribute("class", classList);

  const heading = document.createElement("div");
  // heading.innerText = "Outline";
  heading.innerHTML = `
    <div>Chat outline</div>
  `
  heading.setAttribute("class", "header text-sm pt-4 px-3 mb-3 font-medium flex items-center gap-2");
  div.appendChild(heading);

  const messagesWrapper = document.createElement("div");
  messagesWrapper.setAttribute("class", "overflow-y-auto");
  messagesWrapper.style.height = "calc(100vh - 135px)";
  div.appendChild(messagesWrapper);

  let elems = fetchText(selector);

  for(let obj of elems){
    const elemId = Object.keys(obj)[0];
    const innerText = Object.values(obj)[0];
    const div2 = document.createElement("div");

    div2.innerHTML = `<div class="text-sm line-clamp-2">${innerText}</div>`;

    let classList =
      "py-2 px-3 mb-1 cursor-pointer hover:bg-token-sidebar-surface-secondary rounded-lg";
    div2.setAttribute("class", classList);

    div2.addEventListener("click", () => {
      const element = document.getElementById(elemId);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    messagesWrapper.appendChild(div2);
  }
  if(elems.length == 0){
    const emptyMsg = document.createElement("div");
    emptyMsg.innerHTML = `
      <div class="text-sm font-normal opacity-50">At least 2 converstation must be present, start chatting....</div>
    `;
    messagesWrapper.appendChild(emptyMsg);
  }

  const footer = document.createElement("div");
  footer.id = "footer";
  footer.setAttribute("class", "sticky bottom-0 left-0 text-xs text-slate-500  pb-2 bg-token-sidebar-surface-primary");
  footer.innerHTML = `
    <div class="opacity-30 mb-2 border-t border-slate-200 pt-3">
      We do not store any of your chat conversations
    </div>
    <a class="flex items-center opacity-30 hover:opacity-100 transition-all	" href="https://twitter.com/messages/compose?recipient_id=919134466039193600&text=Hey I'm facing issue in chatgpt extension" target="_blank">
      <div class="mr-1 w-4">${flagIcon}</div>
      <div>Report an issue</div>
    </a>
  `;
  div.appendChild(footer)
}

let observer;
function observeNode(){
  observer && observer.disconnect();
  // Observer start
  const childTargetNode = document.querySelector('[data-testid^="conversation-turn"]');
  if(!childTargetNode) return;
  const targetNode = childTargetNode.parentElement;
  const config = {childList: true};
  
  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for(const mutation of mutationList) {
      if (mutation.type === 'childList') {
        setTimeout(() => {
          addElement();
        }, 1000);
      }
    }
  };
  
  observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
  
  // Observer end
}

a = setTimeout(() => {
  addElement();
  observeNode()
}, 1000);


let currentUrlPath = window.location.pathname;
window.addEventListener('click', () => {
  const newUrlPath = window.location.pathname;
  if (currentUrlPath == newUrlPath) return
  currentUrlPath = newUrlPath;

  // show loader anim
  const chatOutlines = document.querySelectorAll("#message-outline .line-clamp-2");
  for (let chatOutline of chatOutlines) {
    chatOutline.remove();
  }
  const loader = document.createElement("div");
  loader.innerHTML = loadingAnim;
  loader.setAttribute("class", "flex justify-center items-center h-4");
  document.querySelector("#message-outline .header").after(loader);

  // end loader anim

  setTimeout(() => {
    addElement()
    observeNode()
  }, 1000);
});

// hacky way to show outline on enter key press for new chat inside textarea
window.addEventListener('keypress', function(event) {

  let userMessages = document.querySelectorAll(selector);
  let outlineMessageElements = document.querySelectorAll("#message-outline .line-clamp-2");
  if (userMessages.length == 1 && !outlineMessageElements.length) {
    addElement()
    observeNode()
  }
});
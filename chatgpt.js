const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");
const copyButton = document.querySelector("#copy-btn");


let changeIcon = function(icon){
    icon.classList.toggle("fa-moon")
   
    }


let userText = null;
const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;
 
const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "dark_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "" : "";

    const defaultText = `<div class="default-text">
                         
                          <img id="image" src="./picture.png"/>
                          <p>How can I help you today?</p>
                          </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
 }

 loadDataFromLocalStorage();

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse =async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body:JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: userText,
        max_tokens: 2048,
        temperature: 0.2,
        n: 1,
        stop: null
        })
    }
    try{
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();

    }catch(error){
        pElement.classList.add("error");
        pElement.textContent ="Oops! Something went wrong while retrieving the response. Please try again.";
    }
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}
const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.classList.toggle("fa-check")
    setTimeout(() => copyBtn.classList.toggle("fa-check"), 1000);
}
const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                    <img src ="./blacklogo.png" alt="chatbot-img">
                  <div class="typing-animation">
                  <div class="typing-dot" style="--delay: 0.2s"></div>
                  <div class="typing-dot" style="--delay: 0.3s"></div>
                  <div class="typing-dot" style="--delay: 0.4s"></div>
                  </div>
                  </div>
                  <i id="copy-btn" onclick="copyResponse(this)" class="fa-regular fa-copy"> </i>
                  </div>`;
   const incomingChatDiv = createElement(html,"incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}
const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if(!userText) return;
    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;
    const html = `<div class="chat-content">
    <div class="chat-details">
    <img src ="logo.jpg" alt="user-img">
    <p></p>
    </div>
    </div>`;
    const outgoingChatDiv = createElement(html,"outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    document.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "" : "";
});
deleteButton.addEventListener("click", () => {
    if(confirm("Are you sure you want to delete all the chats?")){
      localStorage.removeItem("all-chats"); 
      loadDataFromLocalStorage(); 
    }
});
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;   
});
chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleOutgoingChat();
    }    
});
sendButton.addEventListener("click", handleOutgoingChat);
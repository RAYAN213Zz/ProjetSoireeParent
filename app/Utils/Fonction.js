import { History } from './../Api/FonctionAPI.js'


export function loadChats() {
    const chatList = document.querySelector("#chatsList");
    chatList.innerHTML = "";

    for (const element of History) {
        chatList.innerHTML += `<li><a data-chat-id="${element.chatHash}">${element.title ?? "Chat"}</a></li>`;
    }

    chatList.innerHTML += `<li><a data-chat-id="newChat">New Chat</a></li>`
}

export function newChat() {
    const hash = generateChatHash(5);

    History.push({
        title: "Chat",
        chatHash: hash,
        History: [],
    })

    localStorage.setItem("History", JSON.stringify(History));
    return hash;
}

function generateChatHash(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
import { loadChats, newChat } from './Utils/Fonction.js'
import { newAiMessage, fetchStreamingResponse, setChatIndex, loadModel, setModel } from './Api/FonctionAPI.js'

const input = document.querySelector("#input")
const button = document.querySelector("#chat")
const windows = document.querySelector("#windows")

loadModel();
loadChats();

button.addEventListener("click", async () => {
    fetchStreamingResponse(input.value, windows)
})

document.body.addEventListener("click", (event) => {
    if (event.target.dataset.chatId === "newChat") {
        setChatIndex(newChat());
        loadChats();
    }
    else if (event.target.dataset.chatId !== undefined) {
        setChatIndex(event.target.dataset.chatId);
    }
    else if (event.target.dataset.model !== undefined) {
        setModel(event.target.dataset.model)
    }
})


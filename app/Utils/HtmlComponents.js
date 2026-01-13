

const AI_EMPTY_MESSAGE = `
        <div class="chat chat-start">
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA+VBMVEUWFhbhBQD/ggX/rwD6UA//1wAAABcAFhfgBQNcEhL/sgD/gwX/jwT/2gD+fQb6Vw6VDgwQEhZ4UxEADhbtMgn5rAD/zADqxQGgNxNOKxUAEBbPagqkig3Pjgf/tgCkVQ/meAkQFhbPrgdURxSueQ2kcQ1TIRXzTxB1KxXpTBBzERDgvgh1ZBEjGBarORPUCAVqExIxIhYrFhbLQhHdSBC2CwfrAwC9oAlsWxGWfw7jwghXSRTPpQfouQaQahBTOxRhQxKlfA3PdQrxhQakXQ5tMRQ6JhWHOBNEKBWqNhNGIhZNFBOOCA3VKQmhFAycJxDAIgs4FhVAFBQ4pePmAAACU0lEQVR4nO3bW1PTQByG8dRigCJSLCeLDZaDFKGAldYjKiAHLaDw/T8M3rXDvpnZZpNNkOd3/eclz+DVzhgEAAAAAAAAAAAAAAAAAAAAAAAAgKVZKZvZFD43wZeEUs1xtqZnU/nkEYUfFoXVNbePCT9uq9lPeSSGq9PC5y+OhTuLavZVToVPDdPbrn/Df4VilsJMUJhwlUKPKEy4SqFHFCZcpdAjChOuUugRhQlXKfToERdaP0/JR6ciFX5dEA6/vRC+q4H2D3V6dKhm8ylsVMqGSnleqKy3zRfP2XcNeVwWs9FGYQq1KKYwsh2oPNRC6wEKKaSQQgoppJBCCimkkEIKKaQw00Jb0ZF6VgsakfVAPoXHz6ydLCsn9gM/cylcnnpibUoZ4cdXCl/oiEIKKaSQQgoppJBCCimkkEIKKcy00J+cCp8rryXX01wKa+9nhIPTi5eGs111OnMuTi/Ot9Tpkut/TU1WOCYc9Gum8Jc63WyF4rS1pW6LVPhmXJzu6sK6eVqn0CMKh08pHKDQJwqHTykcoNAnCodPKRyg0CcKh08pHKAwI+NKTOFvdSoLx1p187R+GlOoPqGZWmD/smq6vJoTrq7FafXPkiJXu2p17q+8vRX/XpIVvt0rTZhKkjic6FU7Qfu+4Kbrtlra20+vMOb32upV201Tp9tzmy1YobFKIYUUUkghhRRSSCGFFFJIIYX/X+H1AyhUDyXW4v6GbqspFjZvJh3dyt2+62wntefEpnwwHYWcdV5NLRAAAAAAAAAAAAAAAAAAAAAAAOAxuQPJHzWvLzax7wAAAABJRU5ErkJggg==" />
                </div>
            </div>
            <div class="chat-header">
                Mistral
                <time class="text-xs opacity-50">12:46</time>
            </div>
            <div class="chat-bubble">MESSAGE</div>
            <div class="chat-footer opacity-50">Seen at 12:46</div>
        </div>`

          
const HUMAN_EMPTY_MESSAGE = `
        <div class="chat chat-end">
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component"
                        src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png" />
                </div>
            </div>
            <div class="chat-header">
                USER_NAME
                <time class="text-xs opacity-50">12:46</time>
            </div>
            <div class="chat-bubble">MESSAGE</div>
            <div class="chat-footer opacity-50">Seen at 12:46</div>
        </div>`
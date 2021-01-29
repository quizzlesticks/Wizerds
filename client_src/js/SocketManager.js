class SocketManager {
    #_socket;

    constructor(socket) {
        this.#_socket = socket;
    }

    get id() {
        return this.#_socket.id;
    }

    sendCharSelect(char_select, pos, last_state) {
        sock.emit('player_selected', {char_select: char_select, pos: pos, last_state: last_state});
    }

    sendPlayerPos(pos, last_state) {
        this.#_socket.emit("player_move", {last_state: last_state, pos: pos});
    }
}

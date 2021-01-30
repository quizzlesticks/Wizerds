class SocketManager {
    #_sock;

    constructor() {
        this.#_sock = io();
        this.#_sock.on('update_connected_list', this.updateConnectedList);
        this.#_sock.on('new_player_connected', this.newNetworkCharactor);
        this.#_sock.on('player_left', this.deleteNetworkCharactor);
        this.#_sock.on('player_move', this.updateNetworkCharactor);
        this.#_sock.on('connect', this.onConnection);
        this.#_sock.on('disconnect', this.onDisconnection);
        this.#_sock.on('message', this.printMessage);
    }

    get id() {
        return this.#_sock.id;
    }

    sendCharSelect(char_select, pos, last_state) {
        this.#_sock.emit('player_selected', {char_select: char_select, pos: pos, last_state: last_state});
    }

    sendPlayerPos(pos, last_state) {
        this.#_sock.emit("player_move", {last_state: last_state, pos: pos});
    }

    printMessage(data){
        console.log("Data: " + data);
    }

    onConnection() {
        Game.char_select.start();
    }

    onDisconnection() {
        window.cancelAnimationFrame(Game.last_animation_request);
        Game.cm.flushCharacterList();
        Game.registerStartupTask();
        Game.displayDisconnectScreen();
    }

    newNetworkCharactor(data){
        Game.cm.addNetworkCharacter(data.char_select, data.id, data.pos.x, data.pos.y, data.last_state);
    }

    updateConnectedList(data){
        var keys = Object.keys(data);
        var cur;
        for(var i = 0; i < keys.length; i++) {
            if(keys[i] != this.id) {
                cur = data[keys[i]];
                Game.cm.addNetworkCharacter(cur.char_select, cur.id, cur.pos.x, cur.pos.y, cur.last_state);
            }
        }
    }

    deleteNetworkCharactor(data){
        Game.cm.removeNetworkCharacter(data);
    }

    updateNetworkCharactor(data){
        Game.cm.updateNetworkCharactorPosition(data.id, data.last_state, data.pos);
    }
}

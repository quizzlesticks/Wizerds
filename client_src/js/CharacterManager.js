class CharacterManager {
    #_char_list;
    #_id_list;
    #_win;
    #player;
    constructor(win) {
        this.#_win = win;
        this.#_char_list = {};
    }

    get player() {
        return this.#player;
    }

    getCharacter(id) {
        return this.#_char_list[id];
    }

    addPlayerCharacter(socket_manager, player_class, x, y) {
        if(x == undefined || y == undefined) {
            x = this.#_win.default_player_pos.x;
            y = this.#_win.default_player_pos.y;
        }
        this.#_char_list[socket_manager.id] = new CharacterController(this.#_win, socket_manager, player_class, x, y);
        this.#player = this.#_char_list[socket_manager.id];
    }

    addNetworkCharacter(player_class, id, x, y, last_state) {
        if(Object.keys(this.#_char_list).includes(id)){
            return;
        }
        this.#_char_list[id] = new NetworkCharacterController(this.#_win, player_class, id, x, y);
        this.updateNetworkCharactorPosition(id, last_state, {x: x, y: y});
        return this.#_char_list[id];
    }

    updateNetworkCharactorPosition(id, last_state, pos){
        this.#_char_list[id].updateAnimationAndPosition(last_state, pos);
    }

    removeNetworkCharacter(id) {
        delete this.#_char_list[id];
    }

    flushCharacterList() {
        this.#_char_list = {};
    }

    get player_position() {
        return this.#player.pos;
    }

    get post_update_player_position() {
        return this.#player.post_update_position;
    }

    drawAllCharacters(id) {
        const rp = win.relativeToCamera(this.#player.pos);
        var keys = Object.keys(this.#_char_list);
        for(var i = 0; i < keys.length; i++) {
            if(keys[i] != id){
                this.#_char_list[keys[i]].draw(rp);
            }
        }
        this.#_char_list[id].draw();
    }
}

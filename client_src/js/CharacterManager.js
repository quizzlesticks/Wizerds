class CharacterManager {
    #_char_list;
    #_id_list;
    #player;
    constructor() {
        this.#_char_list = {};
    }

    get player() {
        return this.#player;
    }

    getCharacter(id) {
        return this.#_char_list[id];
    }

    addPlayerCharacter(player_class, x, y) {
        if(x == undefined || y == undefined) {
            x = Game.default_player_pos.x;
            y = Game.default_player_pos.y;
        }
        this.#_char_list[Game.socket.id] = new CharacterController(player_class, x, y);
        this.#player = this.#_char_list[Game.socket.id];
    }

    addNetworkCharacter(player_class, id, x, y, last_state) {
        if(Object.keys(this.#_char_list).includes(id)){
            return;
        }
        this.#_char_list[id] = new NetworkCharacterController(player_class, id, x, y);
        this.updateNetworkCharactorPosition(id, last_state, {x: x, y: y});
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
        var keys = Object.keys(this.#_char_list);
        for(var i = 0; i < keys.length; i++) {
            if(keys[i] != id){
                this.#_char_list[keys[i]].draw();
            }
        }
        this.#_char_list[id].draw();
    }
}

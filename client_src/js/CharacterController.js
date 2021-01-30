class CharacterController{
    #_key_states = {"KeyS": false,
               "KeyD": false,
               "KeyA": false,
               "KeyW": false};

    #_mousedown = false;
    #position = {x: undefined, y: undefined};

    #_animator;

    #_speed = 6; //4
    #_dexterity = 30;
    #_dexterity_counter = 0;
    #_projectile_speed = 8;
    #_projectile_lifetime = 120;
    #_attack_min = 10;
    #_attack_max = 20;

    constructor(player_class, x, y, scale=0) {
        this.#_animator = new CharacterAnimatable(player_class, this.x, this.y);
        this.x = x;
        this.y = y;
        this.updateAnimation = this.updateAnimation.bind(this);
        this.draw = this.draw.bind(this);
        window.addEventListener("keydown", this.updateAnimation);
        window.addEventListener("keyup", this.updateAnimation);
        window.addEventListener("mousedown", this.updateAnimation);
        window.addEventListener("mousemove", this.updateAnimation);
        window.addEventListener("mouseup", this.updateAnimation);
    }

    get x() {
        return this.#position.x;
    }

    get y() {
        return this.#position.y;
    }

    get position() {
        return this.#position;
    }

    set x(x) {
        this.#position.x = x;
        Game.camera_position_world_x = x;
        this.#_animator.x = x;
    }

    set y(y) {
        this.#position.y = y;
        Game.camera_position_world_y = y;
        this.#_animator.y = y;
    }

    set position(p) {
        this.x = p.x;
        this.y = p.y;
    }

    //returns the position that the player will have after
    //updating, used for things that draw under the player
    get post_update_position() {
        const p = {x: this.x, y: this.y};
        if(this.#_key_states["KeyA"]) {
            p.x -= this.#_speed;
        }
        if(this.#_key_states["KeyD"]) {
            p.x += this.#_speed;
        }
        if(this.#_key_states["KeyS"]) {
            p.y += this.#_speed;
        }
        if(this.#_key_states["KeyW"]) {
            p.y -= this.#_speed;
        }
        return p;
    }

    #_last_x_sent = undefined;
    #_last_y_sent = undefined;
    #_last_state_sent = undefined;
    #_last_key_sent = undefined;
    #_last_mousedown_position = {x: undefined, y: undefined};
    updatePlayerPosition() {
        if(this.#_key_states["KeyA"]) {
            this.x -= this.#_speed;
        }
        if(this.#_key_states["KeyD"]) {
            this.x += this.#_speed;
        }
        if(this.#_key_states["KeyS"]) {
            this.y += this.#_speed;
        }
        if(this.#_key_states["KeyW"]) {
            this.y -= this.#_speed;
        }

        var last_state = this.#_animator.last_state;
        if(this.x != this.#_last_x_sent || this.y != this.#_last_y_sent || last_state.state != this.#_last_state_sent || last_state.key != this.#_last_key_sent) {
            Game.socket.sendPlayerPos(this.position, this.#_animator.last_state);
            this.#_last_x_sent = this.x;
            this.#_last_y_sent = this.y;
            this.#_last_state_sent = last_state.state;
            this.#_last_key_sent = last_state.key;
        }
    }

    draw() {

        this.#_animator.draw();

        if(this.#_animator.last_state == "attack") {
            //we need to do this:
            //dex roll (check if counter == dex)
            //BUT dex roll needs to always count to dex after a fire so
            //that rapid clicking is not faster than holding down
            //if so fire bullet
            //  the boolet will get information from the firer
            //  i.e the lifetime of the bootlet
            //      the attack damage of the bootlet
            //      the speed of the boooolet
            //      whether the boolet pierces
            //      other special properties
            //      angle of travel
            //      bullet positionition
            //  we just have to generate this information
            //  we will pass it to the bullet pool which will draw Everything
            //  and find a bullet etc.
            //fire on zero so we always fire first count second
            if(this.#_dexterity_counter == 0){
                //fire
                const angle = Game.mouseTangent(this.#_last_mousedown_position);
                const pos_x = this.x;
                const pos_y = this.y;
                const speed_x = this.#_projectile_speed*Math.cos(angle);
                const speed_y = this.#_projectile_speed*Math.sin(angle);
                const damage = this.#_attack_min + Math.random()*(this.#_attack_max-this.#_attack_min);
                Game.bullet_pool.fire(angle, pos_x, pos_y, speed_x, speed_y, damage, this.#_projectile_lifetime, true);
            }
            this.#_dexterity_counter++;
            if(this.#_dexterity_counter == this.#_dexterity) {
                this.#_dexterity_counter = 0;
            }

        } else if( this.#_dexterity_counter != 0) {
            //this solves the issue of rolling the dex counter even when we arent
            //attacking
            this.#_dexterity_counter++;
            if(this.#_dexterity_counter == this.#_dexterity) {
                this.#_dexterity_counter = 0;
            }
        }
        // if(Game.debug) {
        //     //intersecting lines on player
        //     var ctx = Game.context;
        //     ctx.save();
        //     ctx.beginPath();
        //     ctx.strokeStyle = "#ff0000";
        //     ctx.moveTo(0,this.#topZoningLine(0));
        //     ctx.lineTo(Game.player_space_width, this.#topZoningLine(Game.player_space_width));
        //     ctx.stroke();
        //     ctx.beginPath();
        //     ctx.strokeStyle = "#0000ff";
        //     ctx.moveTo(0,this.#bottomZoningLine(0));
        //     ctx.lineTo(Game.player_space_width, this.#bottomZoningLine(Game.player_space_width));
        //     ctx.stroke();
        //     //shows keys
        //     ctx.beginPath();
        //     ctx.strokeStyle = "black";
        //     ctx.fillStyle = "black";
        //     ctx.strokeRect(70, 10, 50, 50);
        //     if(this.#_key_states["KeyW"])
        //         ctx.fillRect(70, 10, 50, 50);
        //     ctx.strokeRect(10, 70, 50, 50);
        //     if(this.#_key_states["KeyA"])
        //         ctx.fillRect(10, 70, 50, 50);
        //     ctx.strokeRect(70, 70, 50, 50);
        //     if(this.#_key_states["KeyS"])
        //         ctx.fillRect(70, 70, 50, 50);
        //     ctx.strokeRect(130, 70, 50, 50);
        //     if(this.#_key_states["KeyD"])
        //         ctx.fillRect(130, 70, 50, 50);
        //     ctx.restore();
        // }
    }

    #_zone = undefined;
    updateAnimation(event) {
        if(event.type == "keydown" && this.#_key_states[event.code]){
            return;
        }
        if(event.type == "mousedown") {
            this.#_mousedown = true;
            this.#_last_mousedown_position = Game.mouseToScreenSpace({x: event.clientX, y: event.clientY});
            this.#_zone = Game.mouseZone(this.#_last_mousedown_position);
            this.#_animator.animate("attack", this.#_zone);
            return;
        }
        if(this.#_mousedown) {
            if(event.type == "mousemove") {
                this.#_last_mousedown_position = Game.mouseToScreenSpace({x: event.clientX, y: event.clientY});
                var zone = Game.mouseZone(this.#_last_mousedown_position);
                if(zone != this.#_zone) {
                    this.#_animator.animate("attack", zone);
                    this.#_zone = zone;
                }
            }else if(Object.keys(this.#_key_states).includes(event.code)){
                this.#_key_states[event.code] = event.type == "keydown";
                return;
            }else if(event.type == "mouseup") {
                this.#_mousedown = false;
                for (state in this.#_key_states){
                    if(this.#_key_states[state]){
                        this.#_animator.animate("move", state);
                        return;
                    }
                }
                this.#_animator.animate("idle", this.#_zone);
                return;
            }
        }
        if(event.type == "mousemove" || event.type == "mouseup" || !Object.keys(this.#_key_states).includes(event.code)){
            return;
        }
        var state = event.type == "keydown";
        if(state && !this.#_key_states[event.code]) {
            this.#_animator.animate("move", event.code);
            this.#_key_states[event.code] = state;
        }else if(!state) {
            this.#_key_states[event.code] = state;
            for (var st in this.#_key_states){
                if(this.#_key_states[st]){
                    this.#_animator.animate("move", st);
                    return;
                }
            }
            this.#_animator.animate("idle", event.code);
        }
    }
}

class NetworkCharacterController{
    #_mousedown = false;
    #position = {x: undefined, y: undefined};

    #_animator;

    constructor(player_class, id, x=0, y=0, scale=0) {
        if(!x && !y) {
            x = Game.default_player_position.x;
            y = Game.default_player_position.y;
        }
        this.#_animator = new CharacterAnimatable(player_class, x, y);
        this.x = x;
        this.y = y;
        this.draw = this.draw.bind(this);
    }

    get x() {
        return this.#position.x;
    }

    get y() {
        return this.#position.y;
    }

    get position() {
        return this.#position;
    }

    set x(x) {
        this.#position.x = x;
        this.#_animator.x = x;
    }

    set y(y) {
        this.#position.y = y;
        this.#_animator.y = y;
    }

    set position(p) {
        this.x = p.x;
        this.y = p.y;
    }

    draw() {
        this.#_animator.draw();
    }

    updateAnimationAndPosition(last_state, pos) {
        this.#_animator.animate(last_state.state, last_state.key);
        this.position = pos;
    }
}

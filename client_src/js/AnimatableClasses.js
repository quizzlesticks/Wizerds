class AnimatableClass {
    //The _ leading char means it should be accessible in someway from outside
    //Everything else is explicitly private
    #_animation_profile;
    #_animloop;
    #_animloop_cur = 0;
    #_animloop_length = 0;
    #_frame_delay = 0;
    #_frame_delay_cur = 0;
    //This is in world space
    #position = {x: undefined, y: undefined};
    #rotation = 0;
    #scale;

    constructor(animation_profile, px, py, scale) {
        this.#_animation_profile = animation_profile;
        this.#_frame_delay = this.#_animation_profile.frame_delay;
        if(!scale){
            scale = this.#_animation_profile.default_scale;
        }
        this.#scale = scale;
        this.x = px;
        this.y = py;
    }

    set x(x) {
        this.#position.x = x;
    }

    set y(y) {
        this.#position.y = y;
    }

    get x() {
        return this.#position.x;
    }

    get y() {
        return this.#position.y;
    }

    set rotation(r) {
        this.#rotation = r;
    }

    get frame() {
        return this.#_animloop_cur;
    }

    get real_frame() {
        return this.#_animloop[this.#_animloop_cur];
    }

    //reset==false is for defining the animation loop with reseting cur
    //this way wiggling the mouse or moving a bunch around enemies
    //doesn't cause the animation to restart constantly
    defineAnimationLoop(loop, reset=true) {
        this.#_animloop = loop;
        this.#_animloop_length = loop.length;
        if(reset) {
            this.#_animloop_cur = 0;
        }
    }

    restartAnimationLoop() {
        this.#_animloop_cur = 0;
    }

    defineAnimationLoopFromKey(key, reset) {
        this.defineAnimationLoop(this.#_animation_profile.animations[key], reset);
    }

    draw(index) {
        const sp = Game.worldToScreenSpace({x: this.x, y: this.y});
        Game.ssm.drawSprite(this.#_animation_profile.id, index, sp.x, sp.y, this.#rotation, this.#scale);
    }

    drawNext() {
        this.draw(this.#_animloop[this.#_animloop_cur]);
        this.#_frame_delay_cur += 1;
        if(this.#_frame_delay_cur > this.#_frame_delay){
            this.#_animloop_cur += 1;
            this.#_frame_delay_cur = 0;
        }
        if(this.#_animloop_cur == this.#_animloop_length){
            this.#_animloop_cur = 0;
        }
    }

    drawPrev() {
        this.draw(this.#_animloop[this.#_animloop_cur])
        this.#_frame_delay_cur += 1;
        if(this.#_frame_delay_cur > this.#_frame_delay){
            this.#_animloop_cur -= 1;
            this.#_frame_delay_cur = 0;
        }
        if(this.#_animloop_cur == -1){
            this.#_animloop_cur = this.#_animloop_length-1;
        }
    }
}

class CharacterAnimatable {
    #_idle;
    #_move;
    #_attack;
    #_cur_animatable;
    #last_state = {state: "idle", key: "KeyS"}; //idle, attack, move + key

    constructor(animation_super_profile, px, py, scale) {
        if(!animation_super_profile) {
            throw new Error("Trying to load unloadable class.");
            return undefined;
        }
        this.#_idle = new AnimatableClass(animation_super_profile.Idle, px, py, scale);
        this.#_idle.defineAnimationLoopFromKey("KeyS");
        this.#_move = new AnimatableClass(animation_super_profile.Move, px, py, scale);
        this.#_attack = new AnimatableClass(animation_super_profile.Attack, px, py, scale);
        this.#_cur_animatable = this.#_idle;
    }

    get last_state() {
        return this.#last_state;
    }

    get frame() {
        return this.#_cur_animatable.frame;
    }

    draw() {
        //console.log(this.#_cur_animatable);
        this.#_cur_animatable.drawNext();
    }

    animate(type, key) {
        if(type == this.#last_state.state && key == this.#last_state.key){
            return;
        }
        switch(type) {
            case "attack":
                //don't reset animation if we only changed direction
                if(this.#last_state.state == "attack") {
                    this.#_attack.defineAnimationLoopFromKey(key, false);
                } else {
                    this.#_cur_animatable = this.#_attack;
                    this.#_attack.defineAnimationLoopFromKey(key);
                    this.#last_state.state = "attack";
                }
                this.#last_state.key = key;
                break;
            case "idle":
                if(this.#last_state.state == "idle") {
                    this.#_idle.defineAnimationLoopFromKey(key, false);
                } else {
                    this.#_cur_animatable = this.#_idle;
                    this.#_idle.defineAnimationLoopFromKey(key);
                    this.#last_state.state = "idle";
                }
                this.#last_state.key = key;
                break;
            case "move":
                if(this.#last_state.state == "move") {
                    this.#_move.defineAnimationLoopFromKey(key, false);
                } else {
                    this.#_cur_animatable = this.#_move;
                    this.#_move.defineAnimationLoopFromKey(key);
                    this.#last_state.state = "move";
                }
                this.#last_state.key = key;
                break;
            default:
                this.#_cur_animatable = this.#_idle;
                this.#_idle.defineAnimationLoopFromKey("KeyS");
                this.#last_state.state = "idle";
                this.#last_state.key = "KeyS";
        }
    }

    set pos(p) {
        this.#_idle.pos = p;
        this.#_move.pos = p;
        this.#_attack.pos = p;
    }

    set x(x) {
        this.#_idle.x = x;
        this.#_move.x = x;
        this.#_attack.x = x;
    }

    set y(y) {
        this.#_idle.y = y;
        this.#_move.y = y;
        this.#_attack.y = y;
    }
}

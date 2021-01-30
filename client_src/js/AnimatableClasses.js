class AnimatableClass {
    //The _ leading char means it should be accessible in someway from outside
    //Everything else is explicitly private
    #_animation_profile;
    #_animloop_start = 0;
    #_animloop_cur = 0;
    #_animloop_end = 0;
    #_frame_delay = 0;
    #_frame_delay_cur = 0;
    //This is in world space
    #position = {x: undefined, y: undefined};
    #rotation = 0;
    #_x_centering_offset;
    #_y_centering_offset;
    #scale;

    constructor(animation_profile, px, py, scale=0) {
        this.#_animation_profile = animation_profile;
        this.#_frame_delay = this.#_animation_profile.frame_delay;
        if(!scale){
            scale = this.#_animation_profile.default_scale;
        }
        this.#scale = scale;
        this.#_x_centering_offset = this.#_animation_profile.sprite_width*this.#scale/2;
        this.#_y_centering_offset = this.#_animation_profile.sprite_height*this.#scale/2;
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

    defineAnimationLoop(start, end, currentIndex=-1) {
        if(currentIndex == -1) {
            currentIndex = start;
        }
        this.#_animloop_start = start;
        this.#_animloop_cur = currentIndex;
        this.#_animloop_end = end;
    }

    defineAnimationLoopFromKey(key) {
        this.defineAnimationLoop(this.#_animation_profile.animations[key].start, this.#_animation_profile.animations[key].stop);
    }

    draw(index) {
        //we must translate to screen space
        const sp = Game.worldToScreenSpace({x: this.x, y: this.y});
        Game.ssm.drawSprite(this.#_animation_profile.id, index, sp.x, sp.y, this.#rotation, this.#scale);
    }

    drawNext() {
        this.draw(this.#_animloop_cur);
        this.#_frame_delay_cur += 1;
        if(this.#_frame_delay_cur > this.#_frame_delay){
            this.#_animloop_cur += 1;
            this.#_frame_delay_cur = 0;
        }
        if(this.#_animloop_cur > this.#_animloop_end){
            this.#_animloop_cur = this.#_animloop_start;
        }
    }

    drawPrev() {
        Game.ssm.drawSprite(this.#_animation_profile.id, this.#_animloop_cur, this.#position.real.x, this.#position.real.y, this.#scale);
        this.#_animloop_cur -= 1;
        if(this.#_animloop_cur < this.#_animloop_start){
            this.#_animloop_cur = this.#_animloop_end;
        }
    }
}

class CharacterAnimatable {
    #_idle;
    #_move;
    #_attack;
    #_cur_animatable;
    #last_state = {state: "idle", key: "KeyS"}; //idle, attack, move + key

    constructor(player_class, px, py, scale=0) {
        var animation_super_profile;
        if(!(animation_super_profile = AnimationProfiles.CharacterClasses[player_class])) {
            throw new Error("Trying to load unloadable class.");
            return undefined;
        }
        this.#_idle = new AnimatableClass(animation_super_profile.Idle, px, py, scale);
        this.#_move = new AnimatableClass(animation_super_profile.Move, px, py, scale);
        this.#_attack = new AnimatableClass(animation_super_profile.Attack, px, py, scale);
        this.#_cur_animatable = this.#_idle;
    }

    get last_state() {
        return this.#last_state;
    }

    draw() {
        this.#_cur_animatable.drawNext();
    }

    animate(type, key) {
        if(type == this.#last_state.state && key == this.#last_state.key){
            return;
        }
        switch(type) {
            case "attack":
                this.#_cur_animatable = this.#_attack;
                this.#_attack.defineAnimationLoopFromKey(key);
                this.#last_state.state = "attack";
                this.#last_state.key = key;
                break;
            case "idle":
                this.#_cur_animatable = this.#_idle;
                this.#_idle.defineAnimationLoopFromKey(key);
                this.#last_state.state = "idle";
                this.#last_state.key = key;
                break;
            case "move":
                this.#_cur_animatable = this.#_move;
                this.#_move.defineAnimationLoopFromKey(key);
                this.#last_state.state = "move";
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

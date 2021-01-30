class EnemyController {
    #position = {x: 0, y: 0};
    #bounding_rectangle = {top: undefined, bottom: undefined, left: undefined, right: undefined};
    #_animator;
    #active;
    #speed=3;
    constructor(profile) {
        this.#_animator = new CharacterAnimatable(profile, this.#position.x, this.#position.y);
        this.#bounding_rectangle.top = this.#position.y - profile.sprite_height*profile.default_scale/2;
        this.#bounding_rectangle.bottom = this.#position.y + profile.sprite_height*profile.default_scale/2;
        this.#bounding_rectangle.left = this.#position.x - profile.sprite_width*profile.default_scale/2;
        this.#bounding_rectangle.right = this.#position.x + profile.sprite_width*profile.default_scale/2;
    }

    set x(x) {
        this.#bounding_rectangle.left += x-this.#position.x;
        this.#bounding_rectangle.right += x-this.#position.x;
        this.#position.x = x;
        this.#_animator.x = x;
    }

    set y(y) {
        this.#bounding_rectangle.top += y-this.#position.y;
        this.#bounding_rectangle.bottom += y-this.#position.y;
        this.#position.y = y;
        this.#_animator.y = y;
    }

    get bounding_rectangle() {
        return this.#bounding_rectangle;
    }

    get active() {
        return this.#active;
    }

    //DELETEME
    #bigasslaser;
    activate(x,y) {
        this.#_animator.animate("idle", "KeyS");
        this.x = x;
        this.y = y;
        this.#active = true;

        //DELETEME
        this.#bigasslaser = new AnimatableClass(AnimationProfiles.BIGASS.LASER, 0, 0);
        this.#bigasslaser.defineAnimationLoop(AnimationProfiles.BIGASS.LASER.animation);
    }
    //DELETEME
    #lock = false;
    update() {
        const x_delta = this.#position.x - Game.cm.player.position.x;
        const y_delta = this.#position.y - Game.cm.player.position.y;
        const distance = Math.pow(x_delta, 2) +  Math.pow(y_delta, 2);
        const zone = Game.diagonalZone(Game.worldToScreenSpace(this.#position), true);
        //if player is less than or 200 pixels away attack
        if(distance <= 40000 || this.#lock) {
            if(this.#_animator.last_state.state != "attack" || this.#_animator.last_state.key != zone) {
                this.#_animator.animate("attack", zone);
            }
            //DELETEME
            if(!this.#lock) {
                this.#lock = true;
                this.#bigasslaser.x = this.#position.x;
                this.#bigasslaser.y = this.#position.y-30;
                const angle = Math.atan2(-y_delta, -x_delta);
                this.#bigasslaser.rotation = angle;
                var aud = document.getElementById("audi").play();
            }else {
                const angle = Math.atan2(-y_delta, -x_delta);
                this.#bigasslaser.rotation = angle;
            }
        }
        //otherwise if the player is less than or 400 pixels away move at them
        else {//if(distance <= 160000) {
            //only move during hop frames
            if(this.#_animator.last_state.state == "move" && this.#_animator.frame != 0) {
                const angle = Math.atan2(y_delta, x_delta);
                this.x = this.#position.x - Math.cos(angle)*this.#speed;
                this.y = this.#position.y - Math.sin(angle)*this.#speed;
            }
            if(this.#_animator.last_state.state != "move" || this.#_animator.last_state.key != zone) {
                this.#_animator.animate("move", zone);
            }
        }
        //if not just idle and randomly move
        // else {
        //     if(this.#_animator.last_state.state != "idle" || this.#_animator.last_state.key != zone) {
        //         this.#_animator.animate("idle", "KeyS");
        //     }
        // }
    }

    //DELETEME
    #secondlock = false
    draw() {
        this.#_animator.draw();
        //DELETEME
        if(this.#lock){
            Game.ssm.centering = false;
            this.#bigasslaser.drawNext();
            Game.ssm.centering = true;
            if(this.#bigasslaser.real_frame == 35 && !this.#secondlock){
                this.#bigasslaser.defineAnimationLoop(AnimationProfiles.BIGASS.LASER.FOREVER);
                this.#secondlock = true;
            }
        }
    }
}

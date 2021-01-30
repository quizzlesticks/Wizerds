class BulletClass {
    //Please always use my setter for x and y, the bounding rect gets :( when
    //you don't
    #active = false;
    #angle = 0;
    #x = 0;
    #y = 0;
    #speed_y = 0;
    #speed_x = 0;
    #damage = 0;
    #lifetime = 0;
    #lifetime_counter = 0;
    #player_fired = false;

    #_animatable;
    #bounding_rectangle = {top: undefined, bottom: undefined, left: undefined, right: undefined};

    constructor(profile) {
        this.#_animatable = new AnimatableClass(profile, 0, 0);
        this.#_animatable.defineAnimationLoop(profile.animation);
        this.#bounding_rectangle.top = this.#y - profile.sprite_height*profile.default_scale/2;
        this.#bounding_rectangle.bottom = this.#y + profile.sprite_height*profile.default_scale/2;
        this.#bounding_rectangle.left = this.#x - profile.sprite_width*profile.default_scale/2;
        this.#bounding_rectangle.right = this.#x + profile.sprite_width*profile.default_scale/2;
    }

    get active() {
        return this.#active;
    }

    get bounding_rectangle() {
        return this.#bounding_rectangle;
    }

    set x(x) {
        this.#bounding_rectangle.left += x-this.#x;
        this.#bounding_rectangle.right += x-this.#x;
        this.#x = x;
        this.#_animatable.x = x;
    }

    set y(y) {
        this.#bounding_rectangle.top += y-this.#y;
        this.#bounding_rectangle.bottom += y-this.#y;
        this.#y = y;
        this.#_animatable.y = y;
    }

    activate(angle, x, y, sx, sy, damage, lifetime, player_fired) {
        this.#_animatable.rotation = angle;
        this.#_animatable.restartAnimationLoop();
        this.x = x;
        this.y = y;
        this.#speed_x = sx;
        this.#speed_y = sy;
        this.#damage = damage;
        this.#lifetime = lifetime;
        this.#lifetime_counter = 0;
        this.#player_fired = player_fired;
        this.#active = true;
    }

    draw() {
        //draw it
        this.#_animatable.drawNext();
        //update it
        this.x = this.#x + this.#speed_x;
        this.y = this.#y + this.#speed_y;

        this.#lifetime_counter++;
        if(this.#lifetime_counter == this.#lifetime) {
            this.#active = false;
        }
    }
}

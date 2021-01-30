class BulletPool {
    #_pool = [];

    constructor() {
        Game.ssm.loadAllBullets();
        for(var i = 0; i<Game.bullet_pool_size; i++) {
            this.#_pool.push(new BulletClass(AnimationProfiles.BulletProfiles.BlueBullet));
        }
    }

    fire(angle, x, y, speed_x, speed_y, damage, lifetime, player_fired) {
        for(var i = 0; i<Game.bullet_pool_size; i++) {
            if(!this.#_pool[i].active){
                this.#_pool[i].update(angle,x,y,speed_x,speed_y,damage,lifetime,player_fired);
                break;
            }
        }
    }

    draw() {
        Game.ssm.centering=false;
        for(var i = 0; i<Game.bullet_pool_size; i++) {
            if(this.#_pool[i].active){
                this.#_pool[i].draw();
            }
        }
        Game.ssm.centering=true;
    }
}

class BlueSlimePool {
    #_pool = [];

    constructor() {
        //Game.ssm.loadFromProfile(AnimationProfiles.);
    }
}

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
                this.#_pool[i].activate(angle,x,y,speed_x,speed_y,damage,lifetime,player_fired);
                return;
            }
        }
        throw new Error("Out of bullets!");
    }

    draw() {
        for(var i = 0; i<Game.bullet_pool_size; i++) {
            if(this.#_pool[i].active){
                this.#_pool[i].draw();
            }
        }
    }
}

class BlueSlimePool {
    #_pool = [];

    constructor() {
        Game.ssm.loadFromProfile(AnimationProfiles.EnemyProfiles.BlueSlime.Move);
        Game.ssm.loadFromProfile(AnimationProfiles.EnemyProfiles.BlueSlime.Attack);
        for(var i = 0; i<Game.blue_slime_pool_size; i++) {
            this.#_pool.push(new EnemyController(AnimationProfiles.EnemyProfiles.BlueSlime))
        }
    }

    spawn(x, y) {
        for(var i = 0; i<Game.blue_slime_pool_size; i++) {
            if(!this.#_pool[i].active){
                this.#_pool[i].activate(x,y);
                return;
            }
        }
        throw new Error("Out of blue slimes!");
    }

    draw() {
        for(var i = 0; i<Game.blue_slime_pool_size; i++) {
            if(this.#_pool[i].active){
                this.#_pool[i].update();
                this.#_pool[i].draw();
            }
        }
    }
}

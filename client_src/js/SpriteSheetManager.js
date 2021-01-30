class SpriteSheet {
    constructor(filename, width, height, rows, cols, callback) {
        this._width = width;
        this._height =  height;
        this._cols = cols;
        this._rows = rows;
        this._img = new Image();
        this._img.src = filename;
        this._img.onload = callback;
    }

    get img() {
        return this._img;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get cols() {
        return this._cols;
    }
    get rows() {
        return this._rows;
    }
}

class SpriteSheetManager {
    #centering = true;
    #loaded_count = 0;
    #loading_count = 0;
    #finished_loading = false;
    #finished_new_loading = false;
    #throwaway_callback = true;
    #_SpriteSheetList = {};
    constructor(throwaway_callback = true) {
        this.imgLoaded = this.imgLoaded.bind(this);
        this.#throwaway_callback = throwaway_callback;
    }

    imgLoaded() {
        this.#loaded_count += 1;
        if(this.#loaded_count == this.#loading_count) {
            this.#finished_loading = true;
            if(this.callback) {
                this.callback();
                if(this.#throwaway_callback) {
                    this.callback = undefined;
                }
            }
        }
    }

    loadAllCharacterClasses() {
        var k_array = Object.keys(AnimationProfiles.CharacterProfiles);
        var kk_array;
        for(var i=0; i<k_array.length; i++){
            kk_array = Object.keys(AnimationProfiles.CharacterProfiles[k_array[i]])
            for(var j=0; j<kk_array.length; j++) {
                this.loadFromProfile(AnimationProfiles.CharacterProfiles[k_array[i]][kk_array[j]]);
            }
        }
    }

    loadAllBullets() {
        var k_array = Object.keys(AnimationProfiles.BulletProfiles);
        for(var i=0; i<k_array.length; i++){
            this.loadFromProfile(AnimationProfiles.BulletProfiles[k_array[i]]);
        }
    }

    loadFromProfile(p) {
        this.load(p.filename, p.id, p.sprite_width, p.sprite_height, p.sprite_rows, p.sprite_columns);
    }

    load(filename, id, width, height, rows, cols) {
        if(Object.keys(this.#_SpriteSheetList).includes(id)) {
            return;
        }
        this.#finished_loading = false;
        this.#loading_count += 1;
        this.#_SpriteSheetList[id] = new SpriteSheet(filename, width, height, rows, cols, this.imgLoaded);
    }

    getSheet(id) {
        return this.#_SpriteSheetList[id];
    }

    drawSprite(id, index, dx, dy, rotation, dWidth = 0, dHeight = 0) {
        const cur = this.#_SpriteSheetList[id];
        if(index >= cur.cols*cur.rows){
            console.log(id);
            throw new Error("Requested unobtainable sprite.");
        }
        if(!dHeight && dWidth){
            //If only one scaling attribute is given take it as a scaling value
            dHeight = Math.round(cur.height * dWidth);
            dWidth = Math.round(cur.width * dWidth);
        } else {
            if(!dWidth){
                dWidth = cur.width;
            }
            if(!dHeight){
                dHeight = cur.height;
            }
        }
        if(rotation) {
            //we must move to the center of what we are drawing,
            //rotate
            //move back to 0,0
            //draw
            //reset context so future things don't draw weird
            //start by saving ctx so we can reset
            Game.context.save();
            //get the center of the image to draw
            if(this.#centering) {
                Game.context.translate(dx + cur.width/2, dy + cur.height/2);
            } else {
                Game.context.translate(dx, dy + cur.height/2);
            }
            //rotate
            Game.context.rotate(rotation);
            //move back for draws
            if(this.#centering) {
                Game.context.translate( -(dx + cur.width/2), -(dy + cur.height/2));
            } else {
                Game.context.translate(-dx, -(dy + cur.height/2));
            }
            //draw it
            if(this.#centering) {
                Game.context.drawImage(cur.img, (index%cur.cols)*cur.width, Math.floor(index/cur.cols)*cur.height, cur.width, cur.height, dx-dWidth/2, dy-dHeight/2, dWidth, dHeight);
            } else {
                Game.context.drawImage(cur.img, (index%cur.cols)*cur.width, Math.floor(index/cur.cols)*cur.height, cur.width, cur.height, dx, dy, dWidth, dHeight);
            }
            //reset
            Game.context.restore();
        } else {
            if(this.centering) {
                Game.context.drawImage(cur.img, (index%cur.cols)*cur.width, Math.floor(index/cur.cols)*cur.height, cur.width, cur.height, dx-dWidth/2, dy-dHeight/2, dWidth, dHeight);
            } else {
                Game.context.drawImage(cur.img, (index%cur.cols)*cur.width, Math.floor(index/cur.cols)*cur.height, cur.width, cur.height, dx, dy, dWidth, dHeight);
            }
        }
    }

    set whenFinishedLoading(callback) {
        this.callback = callback;
        if(this.#finished_loading) {
            this.callback();
            if(this.#throwaway_callback){
                this.callback = undefined;
            }
        }
    }

    get centering() {
        return this.#centering;
    }

    set centering(c) {
        this.#centering = c;
    }
}

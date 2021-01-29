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
    #loaded_count = 0;
    #loading_count = 0;
    #finished_loading = false;
    #finished_new_loading = false;
    #throwaway_callback = true;
    constructor(ctx, throwaway_callback = true) {
        this.SpriteSheetList = new Map();
        this.imgLoaded = this.imgLoaded.bind(this);
        this.ctx = ctx;
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

    loadAllCharacterClasses(AnimProfiles) {
        var k_array = Object.keys(AnimProfiles.CharacterClasses);
        var prof;
        var kk_array;
        for(var i=0; i<k_array.length; i++){
            kk_array = Object.keys(AnimProfiles.CharacterClasses[k_array[i]])
            for(var j=0; j<kk_array.length; j++) {
                prof = AnimProfiles.CharacterClasses[k_array[i]][kk_array[j]];
                this.load(prof.filename, prof.id, prof.sprite_width, prof.sprite_height, prof.sprite_rows, prof.sprite_columns);
            }
        }
    }

    load(filename, id, width, height, rows, cols) {
        this.#finished_loading = false;
        this.#loading_count += 1;
        this.SpriteSheetList[id] = new SpriteSheet(filename, width, height, rows, cols, this.imgLoaded);
    }

    getSheet(id) {
        return this.SpriteSheetList[id];
    }

    drawSprite(id, index, dx, dy, dWidth = 0, dHeight = 0) {
        var cur = this.SpriteSheetList[id];
        if(index >= cur.cols*cur.rows){
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
        this.ctx.drawImage(cur.img, (index%cur.cols)*cur.width, Math.floor(index/cur.cols)*cur.height, cur.width, cur.height, dx, dy, dWidth, dHeight);
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
}

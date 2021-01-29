class WindowManager {
    #_canvas;
    #_context;
    #_height;
    #_width;
    #_gui_width;
    #menu_background_color = "#2c0c27";
    #menu_text_color = "#bbb7b7";
    #_ssm;
    #_smoothing;
    #_default_scale = 2;
    #_debug = false;
    #_spritefolder = "/Spritesheets";
    #camera_pos = {x: undefined, y: undefined};
    #tile_size = 64;
    #num_tiles_horizontal;
    #num_tiles_vertical;
    #default_player_pos = {x: 7000, y: 12100};

    constructor(width=1000, height=800, gui_width=250, smoothing=false) {
        this.#_canvas = document.getElementById('canvas');
        this.#_context = this.#_canvas.getContext("2d");
        this.resizeWindow(width, height);
        this.#_gui_width = gui_width;
        this.#_ssm = new SpriteSheetManager(this.#_context);
        this.smoothing = smoothing;
        this.#camera_pos.x = this.player_space_width/2;
        this.#camera_pos.y = this.player_space_height/2;
        this.#num_tiles_horizontal = Math.ceil(this.#_width/this.#tile_size)+4;
        if(this.#num_tiles_horizontal%2==0) {this.#num_tiles_horizontal += 1;}
        this.#num_tiles_vertical = Math.ceil(this.#_height/this.#tile_size)+2;
        if(this.#num_tiles_vertical%2==0) {this.#num_tiles_vertical += 1;}
    }

    resizeWindow(width,height){
        this.#_width = width;
        this.#_height = height;
        this.#_canvas.width = width;
        this.#_canvas.height = height;
    }

    clearWindow(color="black"){
        this.#_context.save();
        this.#_context.fillStyle = color;
        this.#_context.fillRect(0,0,canvas.width,canvas.height);
        this.#_context.restore();
    }

    displayDisconnectScreen(){
        this.clearWindow(this.#menu_background_color);
        const ctx = this.#_context;
        ctx.save();
        this.setDefaultFont();
        ctx.fillText("No wizards here...",this.width/2, this.height/2);
        ctx.restore();
    }

    setDefaultFont(){
        this.#_context.font = "30px Helvetica";
    	this.#_context.textAlign = "center";
        this.#_context.fillStyle = this.#menu_text_color;
        this.#_context.strokeStyle = this.#menu_text_color;
    }

    get menu_background_color() {
        return this.#menu_background_color;
    }

    get menu_text_color() {
        return this.#menu_text_color;
    }

    get default_player_pos() {
        return this.#default_player_pos;
    }

    get camera_pos() {
        return this.#camera_pos;
    }

    set camera_pos(p) {
        this.#camera_pos.x = p.x;
        this.#camera_pos.y = p.y;
    }

    get tile_size() {
        return this.#tile_size;
    }

    get num_tiles_horizontal() {
        return this.#num_tiles_horizontal;
    }

    get num_tiles_vertical() {
        return this.#num_tiles_vertical;
    }

    get spritefolder() {
        return this.#_spritefolder;
    }

    set debug(d) {
        this.#_debug = d;
    }

    get debug() {
        return this.#_debug;
    }

    set scale(s = 2) {
        this.#_default_scale = s;
    }

    get scale() {
        return this.#_default_scale;
    }

    get canvas() {
        return this.#_canvas;
    }

    get context() {
        return this.#_context;
    }

    get ssm() {
        return this.#_ssm;
    }

    get width() {
        return this.#_width;
    }

    get height() {
        return this.#_height;
    }

    set smoothing(s) {
        this.#_smoothing = s;
        this.#_context.imageSmoothingEnabled = s;
    }

    get smoothing() {
        return this.#_smoothing;
    }

    get player_space_width() {
        return this.#_width - this.#_gui_width;
    }

    get player_space_height() {
        return this.#_height;
    }

    get gui_width() {
        return this.#_gui_width;
    }

    mouseToCanvas(pos) {
        var rect = this.#_canvas.getBoundingClientRect();
        return {x: pos.x - rect.left, y: pos.y - rect.top};
    }

    relativeToCamera(pos) {
        return {x: this.#camera_pos.x - pos.x, y: this.#camera_pos.y - pos.y};
    }

    positionToMapPosition(pos) {
        return {x: pos.x/this.#tile_size, y: pos.y/this.#tile_size};
    }
}

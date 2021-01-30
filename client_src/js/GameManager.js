class GameManager {
    #_canvas;
    #_context;
    #_socket;
    #_cm;
    #_map;
    #_item_gui;
    #_char_select

    #seed = "RealmOfTheMattGod";
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
    #camera_position = { world_space: {x: undefined, y: undefined},
                    screen_space: {x: undefined, y: undefined}};
    #_mouse_zoner;
    #tile_size = 64;
    #num_tiles_horizontal;
    #num_tiles_vertical;
    #default_player_pos = {x: 7000, y: 12100};
    #bullet_pool;

    constructor(width=1000, height=800, gui_width=250, smoothing=false) {
        this.#_canvas = document.getElementById('canvas');
        this.#_context = this.#_canvas.getContext("2d");
        this.resizeWindow(width, height);
        this.#_gui_width = gui_width;
        this.smoothing = smoothing;
        this.#camera_position.screen_space.x = this.player_space_width/2;
        this.#camera_position.screen_space.y = this.player_space_height/2;
        this.#_mouse_zoner = new MouseZoner(this.player_space_width, this.player_space_height, this.#camera_position.screen_space);
        this.#num_tiles_horizontal = Math.ceil(this.#_width/this.#tile_size)+4;
        if(this.#num_tiles_horizontal%2==0) {this.#num_tiles_horizontal += 1;}
        this.#num_tiles_vertical = Math.ceil(this.#_height/this.#tile_size)+2;
        if(this.#num_tiles_vertical%2==0) {this.#num_tiles_vertical += 1;}
        this.startupTaskFinished = this.startupTaskFinished.bind(this);
    }

    init() {
        this.#_ssm = new SpriteSheetManager();
        this.#_ssm.loadAllCharacterClasses(AnimationProfiles);
        this.#_socket = new SocketManager();
        this.#_cm = new CharacterManager();
        this.registerStartupTask();
        this.#_char_select = new CharSelectGui(() =>
              {Game.cm.addPlayerCharacter(Game.char_select.selected_char);
               Game.socket.sendCharSelect(Game.char_select.selected_char, Game.cm.player.pos, {state: "idle", key: "KeyS"})
               Game.startupTaskFinished(); });
        this.#_map = new MapManager();
        this.#_item_gui = new ItemGui();
        this.#bullet_pool = new BulletPool();
    }

    #_startup_tasks_to_finish = 0;
    #_startup_tasks_finished = 0;
    #game_initialized = false;
    #last_animation_request;
    #runWhenFinished;
    startupTaskFinished() {
        this.#_startup_tasks_finished += 1;
        if(this.#_startup_tasks_finished == this.#_startup_tasks_to_finish && this.#runWhenFinished != undefined) {
            this.#last_animation_request = window.requestAnimationFrame(this.#runWhenFinished);
        }
    }

    registerStartupTask() {
        this.#_startup_tasks_to_finish++;
    }

    set runWhenFinished(f) {
        this.#runWhenFinished = f;
        if(this.#_startup_tasks_finished == this.#_startup_tasks_to_finish) {
            this.#last_animation_request = window.requestAnimationFrame(this.#runWhenFinished);
        }
    }

    get initialized() {
        return this.#game_initialized;
    }

    get last_animation_request() {
        return this.#last_animation_request;
    }

    set last_animation_request(l) {
        this.#last_animation_request = l;
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

    get seed() {
        return this.#seed;
    }

    get map() {
        return this.#_map;
    }

    get item_gui() {
        return this.#_item_gui;
    }

    get char_select() {
        return this.#_char_select;
    }

    get socket() {
        return this.#_socket;
    }

    get bullet_pool() {
        return this.#bullet_pool;
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

    get camera_position_world() {
        return this.#camera_position.world_space;
    }

    set camera_position_world_x(x) {
        this.#camera_position.world_space.x = x;
    }

    set camera_position_world_y(y) {
        this.#camera_position.world_space.y = y;
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

    get cm() {
        return this.#_cm;
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

    mouseToScreenSpace(pos) {
        var rect = this.#_canvas.getBoundingClientRect();
        return {x: pos.x - rect.left, y: pos.y - rect.top};
    }

    worldToScreenSpace(pos) {
        return {x: this.#camera_position.screen_space.x + (pos.x - this.#camera_position.world_space.x), y: this.#camera_position.screen_space.y + (pos.y - this.#camera_position.world_space.y)};
    }

    screenToWorldSpace(pos) {
        return {x: this.#camera_position.world_space.x + (pos.x - this.#camera_position.screen_space.x), y: this.#camera_position.world_space.y + (pos.y - this.#camera_position.screen_space.y)};
    }

    worldToMapSpace(pos) {
        return {x: pos.x/this.#tile_size, y: pos.y/this.#tile_size};
    }

    mapToWorldSpace(pos) {
        return {x: pos.x*this.#tile_size, y: pos.y*this.#tile_size};
    }

    mouseTangent(mouse_pos) {
        //rotate uses radians so use radians
        //Math.atan2 also returns the angle in radians :o perfect
        //atan2 uses (0,0) as a center so center the mouse to camera_position
        const x = mouse_pos.x - this.#camera_position.screen_space.x;
        const y = mouse_pos.y - this.#camera_position.screen_space.y;
        return Math.atan2(y,x);
    }

    mouseZone(mp) {
        return this.#_mouse_zoner.findMouseZone(mp);
    }
}

class MouseZoner {
    #_slope;
    #_top_b;
    #_bottom_b;

    //size of player space (i.e. win - gui)
    #_width;
    #_height;
    //camera pos in screen space
    #_x;
    #_y;

    constructor(width, height, pos) {
        this.#_x = pos.x;
        this.#_y = pos.y;
        this.#_width = width;
        this.#_height = height;
        this.#updateMouseZones();
    }

    #updateMouseZones() {
        this.#_slope = this.#_height/this.#_width;
        this.#_top_b = this.#_y - this.#_slope * this.#_x;
        this.#_bottom_b = this.#_y + this.#_slope * this.#_x - this.#_height;
    }

    findMouseZone(mp) {
        //If we are exactly on the camera return zone 0 (right)
        if(mp.x == this.#_x && mp.y == this.#_y){
            return "KeyD";
        }
        //If we are under the top line (positive for canvas, in standard cartesian this is the one with negative slope and we are 'under' it)
        if(mp.y >= this.#topZoningLine(mp.x)) {
            //then we are in either zone 2 or 3
            //If we are under the bottom line
            if(mp.y >= this.#bottomZoningLine(mp.x)) {
                //We are in zone 3
                return "KeyS";
            } else {
                //Otherwise we must be in zone 2
                return "KeyA";
            }
        } else {
            //Otherwise we are in either zone 0 or 1
            //If we are under the bottom line
            if(mp.y >= this.#bottomZoningLine(mp.x)) {
                //We are in zone 0
                return "KeyD";
            } else {
                //Otherwise we are in zone 1
                return "KeyW";
            }
        }
    }

    #topZoningLine(x) {
        return this.#_slope*x + this.#_top_b;
    }

    #bottomZoningLine(x) {
        return this.#_height - this.#_slope*x + this.#_bottom_b;
    }
}

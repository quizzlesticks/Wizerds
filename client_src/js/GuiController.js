class ItemGui {

    constructor() {
    }

    draw() {
        Game.context.save();
        Game.context.fillStyle = "#524848d4";
        Game.context.fillRect(Game.width - Game.gui_width, 0, Game.gui_width, Game.height);
        Game.context.restore();
    }
}

class CharSelectGui {
    #_selected_char;
    #square_width = 200;
    #gap = 50;
    #_after_select;
    #left_edge_first_box;
    #right_edge_first_box;
    #top_edge_first_box;
    #bottom_edge_first_box;
    #left_edge_second_box;
    #right_edge_second_box;
    #top_edge_second_box;
    #bottom_edge_second_box;

    constructor(after_select) {
        this.draw = this.draw.bind(this);
        this.close = this.close.bind(this);
        this.#_after_select = after_select;

        this.#left_edge_first_box = Game.width/2-this.#square_width-this.#gap/2;
        this.#right_edge_first_box = this.#left_edge_first_box + this.#square_width;
        this.#top_edge_first_box = Game.height/2-this.#square_width/2;
        this.#bottom_edge_first_box = this.#top_edge_first_box + this.#square_width;

        this.#left_edge_second_box = Game.width/2+this.#gap/2;
        this.#right_edge_second_box = this.#left_edge_second_box + this.#square_width;
        this.#top_edge_second_box = Game.height/2-this.#square_width/2;
        this.#bottom_edge_second_box = this.#top_edge_second_box + this.#square_width;
    }

    get selected_char() {
        return this.#_selected_char;
    }

    start() {
        window.addEventListener("mousemove", this.draw);
        window.addEventListener("mousedown", this.draw);
    }

    draw(e) {
        var mp = Game.mouseToScreenSpace({x: e.clientX, y: e.clientY});
        if(e.type == "mousedown"){
            if(mp.x >= this.#left_edge_first_box && mp.x <= this.#right_edge_first_box && mp.y >= this.#top_edge_first_box && mp.y <= this.#bottom_edge_first_box){
                this.#_selected_char = "RedRidingHood";
                this.close();
                return;
            }
            if(mp.x >= this.#left_edge_second_box && mp.x <= this.#right_edge_second_box && mp.y >= this.#top_edge_second_box && mp.y <= this.#bottom_edge_second_box){
                this.#_selected_char = "SciGuy";
                this.close();
                return;
            }
        }
        Game.clearWindow(Game.menu_background_color);
        var ctx = Game.context;
        ctx.save();
        ctx.strokeStyle = Game.menu_text_color;
        ctx.strokeRect(this.#left_edge_first_box, this.#top_edge_first_box, this.#square_width, this.#square_width);
        if(mp.x >= this.#left_edge_first_box && mp.x <= this.#right_edge_first_box && mp.y >= this.#top_edge_first_box && mp.y <= this.#bottom_edge_first_box){
                ctx.fillStyle = "#00ff00bb";
                ctx.fillRect(this.#left_edge_first_box, this.#top_edge_first_box, this.#square_width, this.#square_width);
        }
        ctx.strokeRect(this.#left_edge_second_box,this.#top_edge_second_box, this.#square_width, this.#square_width);
        if(mp.x >= this.#left_edge_second_box && mp.x <= this.#right_edge_second_box && mp.y >= this.#top_edge_second_box && mp.y <= this.#bottom_edge_second_box){
                ctx.fillStyle = "#00ff00bb";
                ctx.fillRect(this.#left_edge_second_box, this.#top_edge_second_box, this.#square_width, this.#square_width);
        }
        Game.setDefaultFont();
    	ctx.fillText("RRH",Game.width/2-this.#square_width/2-this.#gap/2, Game.height/2);
        ctx.fillText("SG",Game.width/2+this.#square_width/2+this.#gap/2, Game.height/2);
        ctx.fillText("Wizards keep that thang on them.",Game.width/2, 200);
        ctx.restore();

    }

    close() {
        window.removeEventListener("mousemove", this.draw);
        window.removeEventListener("mousedown", this.draw);
        this.#_after_select();
    }
}

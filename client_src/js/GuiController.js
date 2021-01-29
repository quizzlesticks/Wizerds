class ItemGui {
    #_win;

    constructor(win) {
        this.#_win = win;
    }

    draw() {
        var ctx = this.#_win.context;
        ctx.save();
        ctx.fillStyle = "#524848d4";
        ctx.fillRect(this.#_win.width - this.#_win.gui_width, 0, this.#_win.gui_width, this.#_win.height);
        ctx.restore();
    }
}

class CharSelectGui {
    #_selected_char;
    #square_width = 200;
    #gap = 50;
    #_win;
    #_after_select;
    #left_edge_first_box;
    #right_edge_first_box;
    #top_edge_first_box;
    #bottom_edge_first_box;
    #left_edge_second_box;
    #right_edge_second_box;
    #top_edge_second_box;
    #bottom_edge_second_box;

    constructor(win, after_select) {
        this.#_win = win;
        this.draw = this.draw.bind(this);
        this.close = this.close.bind(this);
        this.#_after_select = after_select;

        this.#left_edge_first_box = this.#_win.width/2-this.#square_width-this.#gap/2;
        this.#right_edge_first_box = this.#left_edge_first_box + this.#square_width;
        this.#top_edge_first_box = this.#_win.height/2-this.#square_width/2;
        this.#bottom_edge_first_box = this.#top_edge_first_box + this.#square_width;

        this.#left_edge_second_box = this.#_win.width/2+this.#gap/2;
        this.#right_edge_second_box = this.#left_edge_second_box + this.#square_width;
        this.#top_edge_second_box = this.#_win.height/2-this.#square_width/2;
        this.#bottom_edge_second_box = this.#top_edge_second_box + this.#square_width;

        // this.#_win.clearWindow(this.#_win.menu_background_color);
        // var ctx = this.#_win.context;
        // ctx.save();
        // ctx.strokeStyle = this.#_win.menu_text_color;
        // ctx.strokeRect(this.#left_edge_first_box, this.#top_edge_first_box, this.#square_width, this.#square_width);
        // ctx.strokeRect(this.#left_edge_second_box,this.#top_edge_second_box, this.#square_width, this.#square_width);
        // ctx.font = "30px Helvetica";
    	// ctx.textAlign = "center";
    	// ctx.fillStyle = this.#_win.menu_text_color;
    	// ctx.fillText("RRH",this.#_win.width/2-this.#square_width/2-this.#gap/2, this.#_win.height/2);
        // ctx.fillText("SG",this.#_win.width/2+this.#square_width/2+this.#gap/2, this.#_win.height/2);
        // ctx.restore();
    }

    get selected_char() {
        return this.#_selected_char;
    }

    start() {
        window.addEventListener("mousemove", this.draw);
        window.addEventListener("mousedown", this.draw);
        this.draw({clientX: -100, clientY: -100});
    }

    draw(e) {
        var mp = this.#_win.mouseToCanvas({x: e.clientX, y: e.clientY});
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
        this.#_win.clearWindow(this.#_win.menu_background_color);
        var ctx = this.#_win.context;
        ctx.save();
        ctx.strokeStyle = this.#_win.menu_text_color;
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
        this.#_win.setDefaultFont();
    	ctx.fillText("RRH",this.#_win.width/2-this.#square_width/2-this.#gap/2, this.#_win.height/2);
        ctx.fillText("SG",this.#_win.width/2+this.#square_width/2+this.#gap/2, this.#_win.height/2);
        ctx.fillText("Wizards keep that thang on them.",this.#_win.width/2, 200);
        ctx.restore();

    }

    close() {
        window.removeEventListener("mousemove", this.draw);
        window.removeEventListener("mousedown", this.draw);
        this.#_after_select();
    }
}

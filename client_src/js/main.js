const win = new WindowManager();
//win.debug = true;
Math.seedrandom("RealmOfTheMattGod");
const sock = io();
const sock_drawer = new SocketManager(sock);
const gui = new ItemGui(win);
const cm = new CharacterManager(win);
const ssm = win.ssm;
const map = new MapManager(win);

map.render();
var map_image;
createImageBitmap(win.canvas).then(assignMapImage);

//window.addEventListener("mousemove",map.animateDrawUnderCell);

function assignMapImage(img) {
    map_image = img;
    initGame();
}
//
ssm.loadAllCharacterClasses(AnimationProfiles);
const char_select = new CharSelectGui(win, charSelected);

ssm.load("/Spritesheets/bow_test.png", "bow", 34, 34, 1, 1);
ssm.whenFinishedLoading = initGame;

function charSelected(){
    cm.addPlayerCharacter(sock_drawer, char_select.selected_char);
    sock_drawer.sendCharSelect(char_select.selected_char, cm.player.pos, {state: "idle", key: "KeyS"})
    initGame();
}

const game_start = 3; //sprites and char_select and map image
var game_initialized = 0;
var last_animation_request;
function initGame() {
    game_initialized += 1;
    if(game_initialized == game_start) {
        last_animation_request = window.requestAnimationFrame(animate);
    }
}

function animate() {
    win.clearWindow("red");
    const up = cm.post_update_player_position;
    const rp = win.relativeToCamera(up);
    const mp = win.positionToMapPosition({x: -rp.x, y: -rp.y});
    win.context.drawImage(map_image, mp.x, mp.y, win.num_tiles_horizontal, win.num_tiles_vertical, 0, 0, win.num_tiles_horizontal*win.tile_size, win.num_tiles_vertical*win.tile_size);
    map.draw(up);
    cm.drawAllCharacters(sock.id);
    gui.draw();
    ssm.drawSprite("bow",0,win.player_space_width+25,600);
    ssm.drawSprite("bow",0,win.player_space_width+25+50,600);
    ssm.drawSprite("bow",0,win.player_space_width+25+100,600);
    ssm.drawSprite("bow",0,win.player_space_width+25+150,600);
    last_animation_request = window.requestAnimationFrame(animate);
}

sock.on('update_connected_list', updateConnectedList);
sock.on('new_player_connected', newNetworkCharactor);
sock.on('player_left', deleteNetworkCharactor);
sock.on('player_move', updateNetworkCharactor);
sock.on('connect', onConnection);
sock.on('disconnect', onDisconnection);
sock.on('message', printMessage);

function printMessage(data){
    console.log("Data: " + data);
}

function onConnection() {
    char_select.start();
}

function onDisconnection() {
    window.cancelAnimationFrame(last_animation_request);
    cm.flushCharacterList();
    game_initialized--;
    win.displayDisconnectScreen();
}

function newNetworkCharactor(data){
    cm.addNetworkCharacter(data.char_select, data.id, data.pos.x, data.pos.y, data.last_state);
}

function updateConnectedList(data){
    var keys = Object.keys(data);
    var cur;
    for(var i = 0; i < keys.length; i++) {
        if(keys[i] != sock.id) {
            cur = data[keys[i]];
            cm.addNetworkCharacter(cur.char_select, cur.id, cur.pos.x, cur.pos.y, cur.last_state);
        }
    }
}

function deleteNetworkCharactor(data){
    cm.removeNetworkCharacter(data);
}

function updateNetworkCharactor(data){
    cm.updateNetworkCharactorPosition(data.id, data.last_state, data.pos);
}

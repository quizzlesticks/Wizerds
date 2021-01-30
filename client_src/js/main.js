const Game = new GameManager();
Game.init();

Game.map.render();
var map_image;
createImageBitmap(Game.canvas).then(assignMapImage);
Game.registerStartupTask();

function assignMapImage(img) {
    map_image = img;
    Game.startupTaskFinished();
}


Game.ssm.load("/Spritesheets/bow_test.png", "bow", 34, 34, 1, 1);
Game.registerStartupTask();
Game.ssm.whenFinishedLoading = Game.startupTaskFinished;

Game.runWhenFinished = animate;

function animate() {
    Game.clearWindow("red");
    Game.cm.player.updatePlayerPosition();
    const up = Game.cm.player.position;
    const mp = Game.worldToMapSpace(up);
    const gridded_mp = {x: Math.floor(mp.x), y: Math.floor(mp.y)};
    const starting_mp = {x: gridded_mp.x-Math.floor(Game.num_tiles_horizontal/2), y: gridded_mp.y-Math.floor(Game.num_tiles_vertical/2)}
    const rp = Game.worldToScreenSpace(Game.mapToWorldSpace(starting_mp));
    Game.context.drawImage(map_image, starting_mp.x, starting_mp.y, Game.num_tiles_horizontal, Game.num_tiles_vertical, rp.x, rp.y, Game.num_tiles_horizontal*Game.tile_size, Game.num_tiles_vertical*Game.tile_size);
    Game.map.draw();
    Game.cm.drawAllCharacters(Game.socket.id);
    Game.item_gui.draw();
    Game.ssm.drawSprite("bow",0,Game.player_space_width+50,600);
    Game.ssm.drawSprite("bow",0,Game.player_space_width+50+50,600);
    Game.ssm.drawSprite("bow",0,Game.player_space_width+50+100,600);
    Game.ssm.drawSprite("bow",0,Game.player_space_width+50+150,600);
    Game.last_animation_request = window.requestAnimationFrame(animate);
}

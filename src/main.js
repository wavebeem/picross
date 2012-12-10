$(document).ready(function() {
    var m = new GameModel();
    var v = new GameView({model: m});
    var c = new GameController({model: m, view: v});
    v.draw();
});

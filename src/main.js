$(document).ready(function() {
    var modl = new GameModel();
    var view = new GameView({model: modl});
    var cont = new GameController({model: modl, view: view});
    view.draw();
});

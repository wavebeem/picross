$(document).ready(function() {
    var view = new GameView();
    var cont = new GameController({view: view});
    // view.draw();
    view.doTheWave();
});

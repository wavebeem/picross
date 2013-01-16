$(document).ready(function() {
    var model      = new GameModel();
    var view       = new GameView({model: model});
    var controller = new GameController({model: model, view: view});
    var timer      = new Timer();
    view.draw();
    timer.start();
    window.$V = view;
});

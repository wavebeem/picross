$(document).ready(function() {
    var model      = new GameModel();
    var view       = new GameView({model: model});
    var minimap    = new MinimapView({model: model});
    var controller = new GameController({model: model, view: view, minimap: minimap});
    var timer      = new TimerController();
    _([view, minimap]).invoke('draw');
    timer.start();
});

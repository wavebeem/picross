$(document).ready(function() {
    model      = new GameModel();
    view       = new GameView({model: model});
    minimap    = new MinimapView({model: model});
    controller = new GameController({model: model, view: view, minimap: minimap});
    _([view, minimap]).invoke('draw');
});

$(document).ready(function() {
    var model      = new GameModel();
    var view       = new GameView({model: model});
    var controller = new GameController({model: model, view: view});
    var timer      = new Timer();
    var loader     = new Loader({ model: model });

    var useLoader = false;
    loader.load();
    $(window).unload(function() {
        loader[useLoader
            ? 'save'
            : 'erase'
        ]();
    });

    view.draw();
    timer.start();
});

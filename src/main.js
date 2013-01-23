$(document).ready(function() {
    var model      = new GameModel();
    var view       = new GameView({model: model});
    var controller = new GameController({model: model, view: view});
    var timer      = new Timer();
    var loader     = new Loader({ model: model });
    var toolbar    = new Toolbar({ model: model });

    window.console =
    window.console || { log: function(){} };

    // window.localStorage.puzzle_goal = (''
    model.goal = (''
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '...............\n'
        + '#..............\n'
        + '##.............\n'
    );

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

    window.$M = model;
    window.$V = view;
});

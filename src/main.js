var startGame = function(opts) {
    opts = opts || {};
    var model      = new GameModel();
    var view       = new GameView({model: model});
    var controller = new GameController({model: model, view: view});
    var timer      = new Timer();
    var loader     = new Loader({ model: model });
    var toolbar    = new Toolbar({ model: model });

    _(view).extend(opts.view);

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
    if (useLoader) {
        loader.load();
    }
    $(window).unload(function() {
        loader[useLoader
            ? 'save'
            : 'erase'
        ]();
    });

    $('#content').show();

    view.draw();
    timer.start();

    window.$M = model;
    window.$V = view;
};
// $(document).read(startGame);

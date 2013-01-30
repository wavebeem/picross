(function() {
var startGame = function(opts) {
    opts = opts || {};
    var model      = new GameModel();
    var view       = new GameView({model: model});
    var controller = new GameController({model: model, view: view});
    var timer      = new Timer();
    var loader     = new Loader({ model: model });
    var toolbar    = new Toolbar({ model: model });

    _(view).extend(opts.view);

    // window.localStorage.puzzle_goal = (''
    model.goal = (''
        + '###.........###\n'
        + '#.............#\n'
        + '#.............#\n'
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
    );

    Loader.shouldSave = true;
    if (Loader.shouldSave) {
        loader.load();
    }
    $(window).unload(function() {
        loader[Loader.shouldSave
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
var docReady = $.Deferred();
$(document).ready(docReady.resolve);
$.when(fontsLoaded, docReady).then(startGame);
})();

(function() {
var startGame = function(opts) {
    var goal = (''
        // + '.#.#.#.#.#.#.#.\n'
        // + '.#############.\n'
        // + '.#############.\n'
        // + '##...#####...##\n'
        // + '#..#..###..#..#\n'
        // + '##...#####...##\n'
        // + '###############\n'
        // + '#######.#######\n'
        // + '######.########\n'
        // + '#####.#########\n'
        // + '#####.###.#####\n'
        // + '######...######\n'
        // + '..############.\n'
        // + '..############.\n'
        // + '#.............#\n'

        + '####..####\n'
        + '####..####\n'
        + '.##....###\n'
        + '#.......##\n'
        + '###....#.#\n'
        + '###....##.\n'
        + '##..##..##\n'
        + '##..##..##\n'
        + '#...##...#\n'
        + '##.#####.#\n'
    );
    opts = opts || {};
    var model      = new GameModel({ goal: goal });
    var view       = new GameView({ model: model });
    var controller = new GameController({ model: model, view: view });
    var timer      = new Timer();
    var loader     = new Loader({ model: model });
    var toolbar    = new Toolbar({ model: model });

    _(view).extend(opts.view);

    Loader.shouldSave = true;
    if (Loader.shouldSave) {
        loader.load();
    }
    $(window).unload(function() {
        var method = Loader.shouldSave
            ? 'save'
            : 'erase';

        loader[method]();
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

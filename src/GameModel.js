GameModel = (function() {
function GameModel() {
    this.init();
}

function Cell(opts) {
    _.extend(this, opts);
}

_.extend(Cell.prototype, {
    state: 'empty',
});

_.extend(GameModel.prototype, {
    size: 10,
    x: 50,
    y: 50,
    init: function() {
        var S = this.size;
        var puzzle = [];
        _(S).times(function() {
            var row = [];
            _(S).times(function() {
                var cell = new Cell();

                if (_.random(100) < 10) {
                    cell.state = 'marked';
                }

                row.push(cell);
            });
            puzzle.push(row);
        });
        this.puzzle = puzzle;
    },
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },
    eachCell: function(fun, context) {
        if (! fun)
            return;

        var puzzle = this.puzzle;
        var S = this.size;
        _.times(S, function(x) {
            _.times(S, function(y) {
                fun.call(context, x, y, puzzle[y][x]);
            });
        });
    },
});

return GameModel;
})();
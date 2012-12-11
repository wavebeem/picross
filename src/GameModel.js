GameModel = (function() {
function GameModel() {
    this.init();
}

function Cell(opts) {
    _.extend(this, opts);
}

_.extend(Cell.prototype, {
    state: 'empty',
    crosshair: false,
});

_.extend(GameModel.prototype, {
    size: 20,
    x: 0,
    y: 0,
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
                else if (_.random(100) < 5) {
                    cell.state = 'filled';
                }

                row.push(cell);
            });
            puzzle.push(row);
        });
        this.puzzle = puzzle;
    },
    setPosition: function(x, y) {
        this.puzzle[this.y][this.x].crosshair = false;
        this.x = x;
        this.y = y;
        this.puzzle[this.y][this.x].crosshair = true;
    },
    getCell: function(x, y) {
        return this.puzzle[y][x];
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

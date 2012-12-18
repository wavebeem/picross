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
    eraser: false,
    mode: undefined,
    stroking: false,
    size: 20,
    x: 0,
    y: 0,
    directionDeltas: {
        up:     {dx:  0, dy: -1},
        down:   {dx:  0, dy: +1},
        left:   {dx: -1, dy:  0},
        right:  {dx: +1, dy:  0},
    },
    isDirty: false,
    init: function() {
        this.lastPosition = {x: 0, y: 0};
        var S = this.size;
        var puzzle = [];
        _(S).times(function() {
            var row = [];
            _(S).times(function() {
                var cell = new Cell();

                // if (_.random(100) < 10) {
                //     cell.state = 'marked';
                // }
                // else if (_.random(100) < 5) {
                //     cell.state = 'filled';
                // }

                row.push(cell);
            });
            puzzle.push(row);
        });
        this.puzzle = puzzle;
    },
    dumpState: function() {
        var P     = this.puzzle;
        var S     = this.size;
        var txt   = '';
        var chars = {
            filled: '@ ',
            marked: 'x ',
            empty:  '. ',
        };
        txt += '--------+\n';
        txt += 'MODE    |  ' + this.mode     + '\n';
        txt += 'ERASER  |  ' + this.eraser   + '\n';
        txt += 'STROKE  |  ' + this.stroking + '\n';
        _(S).times(function(y) {
            _(S).times(function(x) {
                txt += chars[P[y][x].state];
            });
            txt += '\n';
        });
        console.log(txt);
    },
    startMode: function(mode) {
        var x = this.x;
        var y = this.y;
        var P = this.puzzle;
        var cell   = P[y][x];
        var state  = cell.state;
        var flow   = {
            fill: {
                filled: 'filled',
                marked: 'marked',
                empty:  'filled',
            },
            mark: {
                filled: 'filled',
                marked: 'marked',
                empty:  'marked',
            },
            undefined: {
                filled: 'filled',
                marked: 'marked',
                empty:  'empty',
            }
        };
        var result  = flow[mode][state];
        this.mode   = mode;
        cell.state  = result;

        // this.dumpState();
        if (cell.state !== state) {
            this.isDirty = true;
        }
    },
    moveTo: function(x, y) {
        var S = this.size;
        var P = this.puzzle;
        var Y = this.y;
        var X = this.x;

        if (x < 0
        ||  y < 0
        ||  x >= S
        ||  y >= S)
            return;

        if (y === Y && x === X)
            return;

        var state = P[y][x].state;
        var mode  = this.mode;

        this.lastPosition = {x: X, y: Y};

        P[Y][X].crosshair = false;
        P[y][x].crosshair = true;
        this.x = x;
        this.y = y;
        this.isDirty = true;
        this.startMode(this.mode, this.stroking);
    },
    moveDirection: function(direction) {
        var d = this.directionDeltas[direction];
        if (! d) {
            throw new Error('Unknown direction: ' + direction);
        }
        this.moveTo(this.x + d.dx, this.y + d.dy);
    },
    setCellState: function(state) {
        var x = this.x;
        var y = this.y;
        var cell = this.puzzle[y][x];
        if (cell.state === state)
            return;

        cell.state = state;
        this.isDirty = true;
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

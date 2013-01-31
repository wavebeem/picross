var GameModel = (function() {
function GameModel(opts) {
    this.init(opts);
}

var directionDeltas = {
    up:     {dx:  0, dy: -1},
    down:   {dx:  0, dy: +1},
    left:   {dx: -1, dy:  0},
    right:  {dx: +1, dy:  0},
};

var cellStateToChar = {
    'filled': '#',
    'marked': 'x',
    'empty' : '.',
};
var charToCellState = _.invert(cellStateToChar);

_.extend(GameModel.prototype, {
    eraser: false,
    mode: 'empty',
    stroking: false,
    size: 10,
    x: 0,
    y: 0,
    init: function(opts) {
        var self = this;
        var S = this.size;
        _(this).extend(opts);
        this.undoHistory = [];
        this.lastPosition = {x: 0, y: 0};
        this.hintsSize = Math.floor(S/2) + 1;
        this.events = new Events();
        this.events.register('update', function(info) {
            if (info.group !== 'data')
                return;

            if (self.serializedPuzzleState(true) === self.goal) {
                $('#copyright').text('You win!');
                setTimeout(function() {
                    alert('You win!');
                }, 0);
            }
        });

        this.initPuzzle();
        this.initHints();
    },
    getRow: function(M, x) {
        var self = this;
        var S = this.size;
        var row = [];
        _(S).times(function(y) {
            row.push(M[y][x]);
        });
        return row;
    },
    getCol: function(M, y) {
        var self = this;
        var S = this.size;
        var col = [];
        _(S).times(function(x) {
            col.push(M[y][x]);
        });
        return col;
    },
    getRuns: function(str) {
        var runs = _(str.split(/[^#]/)).foldl(function(arr, run) {
            var n = run.length;
            if (n > 0) {
                arr.push(n);
            }
            return arr;
        }, []);
        runs.reverse();
        return runs.length === 0
            ? [0]
            : runs;
    },
    initHints: function() {
        var self = this;
        var S = this.size;
        this.hintsX = [];
        this.hintsY = [];
        var goalMatrix = this.goal.split('\n');
        _(S).times(function(i) {
            var row = self.getRow(goalMatrix, i).join('');
            var col = self.getCol(goalMatrix, i).join('');
            var xs  = self.getRuns(row);
            var ys  = self.getRuns(col);
            self.hintsX.push(xs);
            self.hintsY.push(ys);
        });
    },
    initPuzzle: function() {
        this.puzzle = [];
        var S = this.size;
        var puzzle = this.puzzle;
        _(S).times(function() {
            var row = [];
            _(S).times(function() {
                row.push({ state: 'empty' });
            });
            puzzle.push(row);
        });
    },
    startMode: function(mode) {
        var x = this.x;
        var y = this.y;
        var P = this.puzzle;
        var cell   = P[y][x];
        var state  = cell.state;
        var result;
        if (mode === state) {
            result = 'empty';
            this.mode = 'empty';
        }
        else if (state === 'empty') {
            result = mode;
            this.mode = mode;
        }
        else {
            result = state;
            this.mode = mode;
        }

        if (result !== state) {
            cell.state = result;
            this.events.fire('update', { group: 'data' });
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

        var cell  = P[y][x];
        var state = cell.state;
        var mode  = this.mode;

        this.lastPosition = {x: X, y: Y};

        this.x = x;
        this.y = y;
        this.events.fire('update', { group: 'cursor' });
        if (state === 'empty' && mode !== 'empty' && state !== mode) {
            cell.state = mode;
            this.events.fire('update', { group: 'data' });
        }
        // this.startMode(this.mode);
    },
    cellStateAt: function(x, y) {
        return this.puzzle[y][x].state;
    },
    moveDirection: function(direction) {
        var d = directionDeltas[direction];
        if (! d) {
            throw new Error('Unknown direction: ' + direction);
        }
        this.moveTo(this.x + d.dx, this.y + d.dy);
    },
    serializedPuzzleState: function(excludeMarks) {
        var self = this;
        var txt = '';
        var S = self.size;
        _(S).times(function(y) {
            _(S).times(function(x) {
                var cell   = self.puzzle[y][x];
                var state  = cell.state
                var marked = state === 'marked';
                var charzy = cellStateToChar[
                    (excludeMarks && marked)
                    ? 'empty'
                    : state
                ];
                txt += charzy;
            });
            txt += '\n';
        });
        return txt;
    },
    undo: function() {
        this.popUndoHistory();
    },
    pushUndoHistory: function() {
        // console.log('PUSHING UNDO HISTORY');
        var state = this.serializedPuzzleState();
        // console.log('PUSHING HISTORY');
        // console.log(state);
        this.undoHistory.push(state);
    },
    popUndoHistory: function() {
        if (this.undoHistory.length === 0)
            return;

        var state = this.undoHistory.pop();
        this.restoreFromSerializedPuzzleState(state);
    },
    restoreFromSerializedPuzzleState: function(state) {
        var self = this;
        var lines = state.split('\n');
        var S = self.size;
        _(S).times(function(y) {
            _(S).times(function(x) {
                self.puzzle[y][x] = {
                    state: charToCellState[lines[y][x]]
                };
            });
        });
        this.events.fire('update', { group: 'data' });
    },
    eachCell: function(fun, context) {
        if (! fun)
            return;

        var puzzle = this.puzzle;
        var S = this.size;
        _(S).times(function(x) {
            _(S).times(function(y) {
                fun.call(context, x, y, puzzle[y][x]);
            });
        });
    },
});

return GameModel;
})();

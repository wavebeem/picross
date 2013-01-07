var GameModel = (function() {
function GameModel() {
    this.init();
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
    mode: 'none',
    stroking: false,
    size: 15,
    hintsSize: 11,
    x: 0,
    y: 0,
    isDirty: false,
    init: function() {
        this.lastPosition = {x: 0, y: 0};
        var S = this.size;
        var puzzle = [];
        _(S).times(function() {
            var row = [];
            _(S).times(function() {
                row.push({ state: 'empty' });
            });
            puzzle.push(row);
        });
        this.puzzle = puzzle;
        this.undoHistory = [];
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
            none: {
                filled: 'filled',
                marked: 'marked',
                empty:  'empty',
            }
        };
        var result  = flow[mode][state];
        this.mode   = mode;

        if (result !== state) {
            cell.state  = result;
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

        this.x = x;
        this.y = y;
        this.isDirty = true;
        this.startMode(this.mode);
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
    serializedPuzzleState: function() {
        var self = this;
        var txt = '';
        var S = self.size - 1;
        self.eachCell(function(x, y, cell) {
            txt += cellStateToChar[cell.state];
            if (y === S) {
                txt += '\n';
            }
        });
        return txt;
    },
    undo: function() {
        this.popUndoHistory();
    },
    pushUndoHistory: function() {
        console.log('PUSHING UNDO HISTORY');
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
                    state: charToCellState[lines[x][y]]
                };
            });
        });
        self.isDirty = true;
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

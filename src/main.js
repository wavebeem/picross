(function() {
var util = {};
var puzzle = (function() {
    var grid = [];
    var S = 0; // board size
    var H = 0; // hints size

    var getTile = function(r, c) {
        return grid[1 + r][1 + c];
    };

    var init = function(size) {
        var K;
        S = size;
        H = Math.ceil(S/2);
        K = S + 1;

        _.times(K, function(r) {
            var row = [];
            _.times(K, function(c) {
                var R = (r === 0);
                var C = (c === 0);
                var isHint  = R || C;
                var isEmpty = R && C;
                var cell = {
                    type:      'normal',
                    crosshair: false,
                    selected:  false,
                    crosshair: false,
                    filled:    false,
                    hints:     []
                };

                if (isEmpty) {
                    cell.type = 'placeholder';
                }
                else if (isHint) {
                    cell.type = 'hint';
                    cell.orientation = (R ? 'vertical' : 'horizontal');
                    cell.hints = [];
                    _.times(_.random(1, H), function() {
                        cell.hints.push(_.random(1, 10));
                    });
                }

                row.push(cell);
            });
            grid.push(row);
        });
    };

    var eachTile = function(fun, includeHints) {
        var start = includeHints ? -1 : 0;
        var r, c;
        for (r = start; r < S; r++) {
            for (c = start; c < S; c++) {
                fun(getTile(r, c), r, c);
            }
        }
    };

    var getSize = function() { return S };

    return {init: init, tile: getTile, eachTile: eachTile, size: getSize};
})();

var size = 10;
var hintsSize = Math.ceil(size/2);

var cursor = {row: 0, col: 0, isClicked: false, hintMode: false};

var highlight = function(row, col) {
    puzzle.eachTile(function(tile, r, c) {
        var R = row === r;
        var C = col === c;
        var isSelected  = (R && C);
        var isCrosshair = (R || C);
        var isHint      = (r < 0 || c < 0);
        tile.type       = isHint ? 'hint' : tile.type;
        tile.crosshair  = isCrosshair;
        tile.selected   = isSelected;
    }, true);
};

var selectTile = function() {
    var c = cursor.col;
    var r = cursor.row;
    var tile = puzzle.tile(r, c);
    var hint = cursor.hintMode;
    var map = cursor.hintMode
        ? {maybe: 'normal', filled: 'filled', normal: 'maybe'}
        : {maybe: 'filled', filled: 'normal', normal: 'filled'};
    tile.type = map[tile.type];
    draw();
};

var max = Math.max;
var min = Math.min;

util.clamp = function(x, a, b) {
    return min(max(x | 0, a), b);
};

util.now = function() {
    return new Date().getTime();
};

var moveCursor = function(row, col) {
    console.log('Moving cursor to', row, col);
    puzzle.eachTile(function(tile, r, c) {
        tile.crosshair = false;
        tile.selected  = false;
    }, true);

    row = util.clamp(row, 0, size - 1);
    col = util.clamp(col, 0, size - 1);

    cursor.row = row;
    cursor.col = col;

    highlight(row, col);

    var c = cursor.col;
    var r = cursor.row;
    var tile = puzzle.tile(r, c);

    if (cursor.isClicked && tile.type !== 'filled') {
        selectTile();
    }

    draw();
};

var translateCursor = function(drow, dcol) {
    var r = cursor.row + drow;
    var c = cursor.col + dcol;
    moveCursor(r, c);
};

var table = {getTile: _.noop};
var createTable = function() {
    var tbody = $('#theTableBody');
    var data  = [];
    _.times(puzzle.size() + 1, function(r) {
        var tr  = $('<tr>');
        var row = [];
        _.times(puzzle.size() + 1, function(c) {
            var isHint = (r === 0 || c === 0);
            var tx = $(isHint ? '<th>' : '<td>');

            var tile = puzzle.tile(r - 1, c - 1);
            if (isHint) {
                _.forEach(tile.hints, function(hint) {
                    var div = $('<div>');
                    var p = $('<p>');
                    div.addClass('hintBackground');
                    p.addClass('hintNumber');
                    p.text('' + hint);
                    div.append(p);
                    tx.append(div);
                });
            }

            tx.data('row', r - 1);
            tx.data('col', c - 1);
            tr.append(tx);
            row.push(tx);
        });
        tbody.append(tr);
        data.push(row);
    });

    var getTile = function(r, c) {
        return data[1 + r][1 + c];
    };

    var eachTile = function(fun, includeHints) {
        var S = puzzle.size();
        var start = includeHints ? -1 : 0;
        var r, c;
        for (r = start; r < S; r++) {
            for (c = start; c < S; c++) {
                fun(getTile(r, c), r, c);
            }
        }
    };

    table = {tile: getTile, eachTile: eachTile};
};

var draw = function() {
    var before = util.now();
    table.eachTile(function(tile, r, c) {
        var newClass = '';
        data = puzzle.tile(r, c);

        var R = (r === -1);
        var C = (c === -1);

        var isPlaceHolder = R && C;
        var isHint        = R || C;

        var maybe = (data.type === 'maybe');

        newClass += data.type + ' ';

        if (isHint) {
            newClass += ((R ? c : r) % 2 === 0) ? 'even ' : 'odd ';
        }

        newClass += 'row_' + r + ' ';
        newClass += 'col_' + c + ' ';

        if ((r + 1) === puzzle.size()) newClass += 'row_n ';
        if ((c + 1) === puzzle.size()) newClass += 'col_n ';

        if (isPlaceHolder)       newClass += 'placeholder ';
        if (data['selected' ])   newClass += 'selected ';
        if (data['crosshair'])   newClass += 'crosshair ';
        if (data['orientation']) newClass += data['orientation'] + ' ';

        if (data.hints.length <= 0) {
            tile.text(maybe ? '\u00d7' : '');
        }

        tile.prop('className', newClass);
    }, true);
    var after = util.now();

    // console.log('draw() took', after - before, 'ms');
};

var loadGame = function() {
    puzzle.init(size);

    createTable();
    draw();

    moveCursor(0, 0);

    var mouseEnterHandler = function(event) {
        var target = $(event.target);

        var row = target.data('row');
        var col = target.data('col');

        if (_.isUndefined(row)) row = cursor.row;
        if (_.isUndefined(col)) col = cursor.col;

        moveCursor(row, col);
    };

    var theTable = $('#theTable');
    theTable.on('mouseenter', 'td, th', mouseEnterHandler);
    theTable.on('mousedown', function(event) {
        cursor.isClicked = true;
        selectTile();
        event.preventDefault();
    });
    $(document).on('mouseup', function(event) {
        cursor.isClicked = false;
        event.preventDefault();
    });

    var kbd = {};
    $(document).keydown(function(event) {
        var key = event.which;
        var keyWasHit = true;
        var modifierHeld = event.ctrlKey || event.altKey || event.metaKey;

        if (kbd[key])
            return;

        kbd[key] = true;

        if (modifierHeld)
            return;

        console.log('Processing key DOWN');
        switch (key) {
        case 73: translateCursor(-1,  0); break;
        case 74: translateCursor( 0, -1); break;
        case 75: translateCursor(+1,  0); break;
        case 76: translateCursor( 0, +1); break;
        case 65: cursor.isClicked = true; cursor.hintMode = true;  selectTile(); break;
        case 32: cursor.isClicked = true; cursor.hintMode = false; selectTile(); break;
        default:
            console.log('keycode:', key);
            keyWasHit = false;
            break;
        }

        if (keyWasHit) {
            event.preventDefault();
        }
        draw();
    });

    var onkeyup = function(event) {
        var key = event.which;
        var keyWasHit = true;
        var modifierHeld = event.ctrlKey || event.altKey || event.metaKey;

        kbd[key] = false;

        if (modifierHeld)
            return;

        console.log('Processing key UP');
        switch (key) {
        case 65: cursor.isClicked = false; cursor.hintMode = false; break;
        case 32: cursor.isClicked = false; cursor.hintMode = true;  break;
        default:
            console.log('keycode:', key);
            keyWasHit = false;
            break;
        }

        if (keyWasHit) {
            event.preventDefault();
        }
        draw();
    };
    $(document).keyup(onkeyup);
};

$(loadGame);
})();

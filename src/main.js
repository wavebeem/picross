(function() {
var util = {};
var puzzle = (function() {
    var grid = [];
    var S = 0; // board size
    var H = 0; // hints size

    var getTile = function(r, c) {
        return grid[H + c][H + r];
    };
    var setTile = function(r, c, t) {
        grid[H + c][H + r] = t;
    };

    var init = function(size) {
        var K;
        S = size;
        H = Math.ceil(S/2);
        K = S + H;

        _.times(K, function(c) {
            var tbody = $('#theTableBody');
            var tr = $('<tr>');
            var row = [];
            _.times(K, function(r) {
                var td = $('<td>');
                td.data('row', r - H);
                td.data('col', c - H);
                var isHint = r < H || c < H;
                if (isHint) {
                    td.addClass('hint');
                    td.text(_.random(1, 4));
                }
                tr.append(td);
                row.push(td[0]);
            });
            tbody.append(tr);
            grid.push(row);
        });
    };

    return {init: init, getTile: getTile, setTile: setTile};
})();

var size = 10;
var hintsSize = Math.ceil(size/2);

var cursor = {row: 0, col: 0, isClicked: false};

var highlight = function(row, col) {
    var classes = {2: 'selected', 1: 'crosshair'};
    _.times(size, function(r) {
        _.times(size, function(c) {
            var td = puzzle.getTile(r, c);
            var R = row === r;
            var C = col === c;
            var cls = classes[0 + R + C];
            if (cls) {
                $(td).addClass(cls);
                if (r < size && c < size) {
                    $(td).addClass('tile');
                }
            }
        });
    });
};

var selectTile = function() {
    var c = cursor.col;
    var r = cursor.row;
    var tile = puzzle.getTile(r, c);
    $(tile).toggleClass('filled');
};

util.clamp = function(x, a, b) {
    var max = Math.max;
    var min = Math.min;

    return min(max(x, a), b);
};

var moveCursor = function(row, col) {
    $('#theTable td').removeClass('crosshair selected');

    row = util.clamp(row | 0, 0, size - 1);
    col = util.clamp(col | 0, 0, size - 1);

    cursor.row = row;
    cursor.col = col;

    highlight(row, col);

    var c = cursor.col;
    var r = cursor.row;
    var tile = $(puzzle.getTile(r, c));
    if (cursor.isClicked && ! tile.hasClass('filled')) {
        selectTile();
    }
};

var translateCursor = function(drow, dcol) {
    var r = cursor.row + drow;
    var c = cursor.col + dcol;
    moveCursor(r, c);
};

var loadGame = function() {
    puzzle.init(size);

    moveCursor(1, 1);

    $('#theTable').on('mouseenter', 'td.tile', function(event) {
        var target = $(event.target);

        var row = target.data('row') >>> 0;
        var col = target.data('col') >>> 0;

        moveCursor(row, col);
    }).on('mousedown', function(event) {
        cursor.isClicked = true;
        selectTile();
        event.preventDefault();
    });
    $(document).on('mouseup', function(event) {
        cursor.isClicked = false;
    });

    $(document).keydown(function(event) {
        var key = event.which;
        var keyWasHit = true;
        var modifierHeld = event.ctrlKey || event.altKey || event.metaKey;

        if (modifierHeld)
            return;

        switch (key) {
        case 73: translateCursor( 0, -1); break;
        case 74: translateCursor(-1,  0); break;
        case 75: translateCursor( 0, +1); break;
        case 76: translateCursor(+1,  0); break;
        case 32: cursor.isClicked = true; selectTile(); break;
        default:
            console.log('keycode:', key);
            keyWasHit = false;
            break;
        }


        if (keyWasHit) {
            event.preventDefault();
        }
    });

    $(document).keyup(function(event) {
        var key = event.which;
        var keyWasHit = true;
        var modifierHeld = event.ctrlKey || event.altKey || event.metaKey;

        if (modifierHeld)
            return;

        switch (key) {
        case 32: cursor.isClicked = false; break;
        default:
            console.log('keycode:', key);
            keyWasHit = false;
            break;
        }

        if (keyWasHit) {
            event.preventDefault();
        }
    });
};

$(loadGame);
})();

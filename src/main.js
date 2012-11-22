(function() {
var util = {};
var puzzle = (function() {
    var grid = [];
    var S = 0; // board size
    var H = 0; // hints size

    var getTile = function(r, c) {
        return grid[1 + r][1 + c];
    };
    var setTile = function(r, c, t) {
        grid[1 + r][1 + c] = t;
    };

    var init = function(size) {
        var K;
        S = size;
        H = Math.ceil(S/2);
        K = S + 1;

        _.times(K, function(r) {
            var tbody = $('#theTableBody');
            var tr = $('<tr>');
            var row = [];
            _.times(K, function(c) {
                var isHint  = r === 0 || c === 0;
                var isEmpty = r === 0 && c === 0;
                var tx = $(isHint? '<th>' : '<td>');
                tx.data('row', r - 1);
                tx.data('col', c - 1);

                tx.addClass('row' + (r - 1));
                tx.addClass('col' + (c - 1));

                if (isHint) {
                    tx.addClass('hint');
                    tx.addClass(r === 0? 'vertical' : 'horizontal');
                    // tx.text(_.random(1, 4));
                    _.times(_.random(1, H), function() {
                        var holder = $('<div>');
                        var num = $('<p>');
                        holder.addClass('hintBackground');
                        num.text(_.random(1, 10));
                        num.addClass('hintNumber');
                        holder.append(num);
                        tx.append(holder);
                    });
                }

                if (isEmpty) {
                    tx.addClass('placeholder');
                }

                tr.append(tx);
                row.push(tx[0]);
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
    _.times(size + 1, function(r) {
        r--;
        _.times(size + 1, function(c) {
            c--;
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
    $('#theTable th').removeClass('crosshair selected');

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

    moveCursor(0, 0);

    $('#theTable').on('mouseenter', '*', function(event) {
        var target = $(event.target);

        var row = target.data('row');
        var col = target.data('col');

        if (_.isUndefined(row)) row = cursor.row;
        if (_.isUndefined(col)) col = cursor.col;

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
        case 73: translateCursor(-1,  0); break;
        case 74: translateCursor( 0, -1); break;
        case 75: translateCursor(+1,  0); break;
        case 76: translateCursor( 0, +1); break;
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

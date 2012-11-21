window.onload = function() {
var elems = {
    table: document.getElementById('theTable'),
    tbody: document.getElementById('theTableBody')
};

var table = [];
var size = 10;

var cursor = {row: 0, col: 0};

var slice = function(ary, n) {
    return Array.prototype.slice.call(ary, n || 0);
};

var times = function(n, f) {
    var i;
    for (i = 0; i < n; i++) f(i);
};

var format = function(str /*, ... */) {
    var args = slice(arguments, 1);
    var i = 0;
    var n = args.length;
    return str.replace(/{\d+}/g, function(tok) {
        var num = tok.substring(1, tok.length - 1);
        return args[num];
    });
};

times(size, function(x) {
    var tr = document.createElement('tr');
    var row = [];
    times(size, function(y) {
        var td = document.createElement('td');
        // var text = document.createTextNode(format('{0}{1}', x, y));
        td.setAttribute('data-row', y);
        td.setAttribute('data-col', x);
        // td.appendChild(text);
        tr.appendChild(td);
        row.push(td);
    });
    elems.tbody.appendChild(tr);
    table.push(row);
});

elems.table.onmousemove = function(event) {
    var target = event.target;

    if (target && target.nodeName !== 'TD')
        return;

    var row = target.getAttribute('data-row') >>> 0;
    var col = target.getAttribute('data-col') >>> 0;

    moveCursor(row, col);
};

var highlight = function(row, col) {
    var classes = {2: 'selected', 1: 'crosshair'};
    times(size, function(r) {
        times(size, function(c) {
            var td = table[c][r];
            var R = row === r;
            var C = col === c;
            td.className = classes[0 + R + C] || '';
        });
    });
};

var clamp = function(x, a, b) {
    var max = Math.max;
    var min = Math.min;

    return min(max(x, a), b);
};

var moveCursor = function(row, col) {
    row = clamp(row | 0, 0, size - 1);
    col = clamp(col | 0, 0, size - 1);

    cursor.row = row;
    cursor.col = col;

    highlight(row, col);
};

moveCursor(1, 1);

var translateCursor = function(drow, dcol) {
    moveCursor(cursor.row + drow, cursor.col + dcol);
};

document.onkeydown = function(event) {
    var key = event.keyCode;
    switch (key) {
    case 73: translateCursor( 0, -1); break;
    case 74: translateCursor(-1,  0); break;
    case 75: translateCursor( 0,  1); break;
    case 76: translateCursor( 1,  0); break;
    };
};
};

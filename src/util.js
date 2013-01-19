var util = (function() {
var max = Math.max;
var min = Math.min;
var add = function(a, b) { return a + b };

var functionCallMaker = function(prefix) {
    return function() {
        var args = [].slice.call(arguments);
        return prefix + '(' + args + ')';
    };
};

var percent = function(x) {
    return (x * 100) + '%';
};

return {
    now: (function() {
        var p = window.performance || {};
        return typeof p.now === 'function'
            ? function() { return p.now() }
            : function() { return +(new Date()) };
    })(),
    clamp: function(x, a, b) {
        return min(max(x, a), b);
    },

    alphaGray: function(n, a)  { return 'rgba(' + [n, n, n, a] + ')' },
    gray: function(n)          { return 'rgb('  + [n, n, n]    + ')' },

    rgba: functionCallMaker('rgba'),
    rgb:  functionCallMaker('rgb' ),

    hsl:  function(h, s, l)    { return 'hsl('  + [h, percent(s), percent(l)]    + ')' },
    hsla: function(h, s, l, a) { return 'hsla(' + [h, percent(s), percent(l), a] + ')' },

    valueOrElse: function(value, fallback) {
        return typeof value === 'undefined' ? fallback : value;
    },
    zeroPad: function(n) {
        return (n < 10 ? '0' : '') + n;
    },
    drawBorderOutsideRect: function(ctx, x, y, w, h, s) {
        var X = x - s;
        var Y = y - s;
        ctx.beginPath();
        ctx.rect(X + 0, Y + 0, w + s, 0 + s); // top
        ctx.rect(X + 0, Y + 0, 0 + s, h + s); // left
        ctx.rect(X + w, Y + 0, 0 + s, h + s); // right
        ctx.rect(X + 0, Y + h, w + s, 0 + s); // bottom
        ctx.fill();
        ctx.closePath();
    },
    drawBorderInsideRect: function(ctx, x, y, w, h, s) {
        ctx.beginPath();
        var S = 2*s;
        ctx.rect(x + 0 - 0, y + 0 - 0, w - s, 0 + s); // top
        ctx.rect(x + 0 - 0, y + 0 - 0, 0 + s, h - s); // left
        ctx.rect(x + w - S, y + 0 - 0, 0 + s, h - s); // right
        ctx.rect(x + 0 - 0, y + h - S, w - s, 0 + s); // bottom
        ctx.fill();
        ctx.closePath();
    },
    odd:  function(x) { return x % 2 === 1 },
    even: function(x) { return x % 2 === 0 },
    sum: function(x) {
        return _(x).foldl(add, 0);
    },
};
})();

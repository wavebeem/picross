var util = (function() {
var max = Math.max;
var min = Math.min;
var add = function(a, b) { return a + b };

return {
    now: (function() {
        var p = window.performance || {};
        return p.now
            ? function() { return p.now() }
            : function() { return +(new Date()) };
    })(),
    clamp: function(x, a, b) {
        return min(max(x, a), b);
    },
    gray: function(n) {
        return 'rgb(' + [n, n, n] + ')';
    },
    alphaGray: function(n, a) {
        return 'rgba(' + [n, n, n, a] + ')';
    },
    rgba: function(r, g, b, a) {
        return 'rgba(' + [r, g, b, a] + ')';
    },
    rgb: function(r, g, b) {
        return 'rgb(' + [r, g, b] + ')';
    },
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
        ctx.rect(X + 0, Y + 0, w + s, 0 + s);
        ctx.rect(X + 0, Y + 0, 0 + s, h + s);
        ctx.rect(X + w, Y + 0, 0 + s, h + s);
        ctx.rect(X + 0, Y + h, w + s, 0 + s);
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

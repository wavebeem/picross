var util = (function() {
var max = Math.max;
var min = Math.min;

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
    valueOrElse: function(value, fallback) {
        return typeof value === 'undefined' ? fallback : value;
    },
    zeroPad: function(n) {
        return (n < 10 ? '0' : '') + n;
    },
};
})();

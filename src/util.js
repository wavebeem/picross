util = (function() {
var util = {};

util.now = (function() {
    var p = window.performance || {};
    return p.now
        ? function() { return p.now() }
        : function() { return +(new Date()) };
})();

var max = Math.max;
var min = Math.min;

util.clamp = function(x, a, b) {
    return min(max(x, a), b);
};

return util;
})();

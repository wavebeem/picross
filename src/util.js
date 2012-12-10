util = (function() {
var util = {};

util.now = (function() {
    var p = window.performance || {};
    return p.now
        ? function() { return p.now() }
        : function() { return +(new Date()) };
})();

return util;
})();

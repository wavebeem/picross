var Toolbar = (function() {
function Toolbar(opts) {
    this.init(opts);
}

_.extend(Toolbar.prototype, {
    init: function(opts) {
        _.extend(this, opts);
        var m = this.model;
        $('#undo-button').on('click', function() { m.undo() });
    },
});

return Toolbar;
})();

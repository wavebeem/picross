var Loader = (function() {
function Loader(opts) {
    this.init(opts);
}

_.extend(Loader.prototype, {
    init: function(opts) {
        _.extend(this, opts);
        this.storage = window.localStorage;
        this.load();
    },
    load: function() {
        var save = this.get('puzzle_state');
        if (save) {
            this.model.restoreFromSerializedPuzzleState(save);
        }
    },
    save: function() {
        var save = this.model.serializedPuzzleState();
        this.set('puzzle_state', save);
    },
    erase: function() {
        delete this.storage['puzzle_state'];
    },
    get: function(key) {
        return this.storage[key];
    },
    set: function(key, val) {
        return this.storage[key] = val;
    },
});

return Loader;
})();

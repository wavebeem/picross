var Loader = (function() {
function Loader(opts) {
    this.init(opts);
}

_.extend(Loader.prototype, {
    init: function(opts) {
        _.extend(this, opts);
        this.storage = window.localStorage;
    },
    load: function() {
        var size = this.get('puzzle_size') | 0;
        var save = this.get('puzzle_save');
        var goal = this.get('puzzle_goal');
        if (save && goal) {
            this.model.size = size;
            this.model.goal = goal;
            this.model.restoreFromSerializedPuzzleState(save);
        }
    },
    save: function() {
        var size = this.model.size;
        var save = this.model.serializedPuzzleState();
        var goal = this.model.goal;
        this.set('puzzle_size', size);
        this.set('puzzle_save', save);
        this.set('puzzle_goal', goal);
    },
    erase: function() {
        delete this.storage['puzzle_size'];
        delete this.storage['puzzle_save'];
        delete this.storage['puzzle_goal'];
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

GameModel = (function() {
function GameModel() {
    this.init();
}

function Cell(opts) {
    _.extend(this, opts);
}

_.extend(Cell.prototype, {
    state: 'empty',
});

_.extend(GameModel.prototype, {
    size: 10,
    x: 50,
    y: 50,
    init: function() {
        var S = this.size;
        this.puzzle = [];
        _(S).times(function() {
            var row = [];
            _(S).times(function() {
                row.push({});
            });
        });
    },
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },
});

return GameModel;
})();

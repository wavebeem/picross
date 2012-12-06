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
    init: function() {
        this.puzzle = [];
        _(size).times(function() {
            var row = [];
            _(size).times(function() {
                row.push({});
            });
        });
    },
});

return GameModel;
})();

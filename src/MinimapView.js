var MinimapView = (function() {
function MinimapView(opts) {
    this.init(opts);
}

var shadow = colors.shadow;

var sizeMapping = {
    25:  3,
    20:  3,
    15:  4,
    10:  6,
     5: 12,
};

_.extend(MinimapView.prototype, {
    color: '#000',
    init: function(opts) {
        var self = this;
        _.extend(this, opts);
        this.size = sizeMapping[this.model.size];
        this.$canvas = $('#minimap');
        this.canvas = this.$canvas[0];
        this.ctx = this.canvas.getContext('2d');
        var N = this.model.size;
        var S = this.size;
        this.canvas.width  = N * S;
        this.canvas.height = N * S;
        this.model.events.register('draw', function() {
            self.draw();
        });
    },
    draw: function() {
        var self = this;
        var N = self.model.size;
        var S = self.size;
        var CS = self.canvas.width;
        var ctx = self.ctx;
        ctx.fillStyle = self.color;
        ctx.clearRect(0, 0, CS, CS);
        self.model.eachCell(function(x, y, cell) {
            if (cell.state === 'filled') {
                ctx.fillRect(S * x, S * y, S, S);
            }
        });

        var Q = CS;
        var q = Q - 1;

        ctx.fillStyle = shadow;
        ctx.beginPath();

        ctx.rect(0, 0, Q, 1);
        ctx.rect(q, 0, 1, Q);
        ctx.rect(0, q, Q, 1);
        ctx.rect(0, 0, 1, Q);

        ctx.fill();
        ctx.closePath();
    },
});

return MinimapView;
})();

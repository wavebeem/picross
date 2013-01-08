var MinimapView = (function() {
function MinimapView(opts) {
    this.init(opts);
}

var shadow = 'rgba(128, 128, 128, 0.95)';

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
        _.extend(this, opts);
        this.size = sizeMapping[this.model.size];
        this.$canvas = $('#minimap');
        this.canvas = this.$canvas[0];
        this.ctx = this.canvas.getContext('2d');
        var N = this.model.size;
        var S = this.size;
        this.canvas.width  = N * S;
        this.canvas.height = N * S;
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
        ctx.beginPath();
        ctx.strokeStyle = shadow;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = 'butt';
        ctx.lineJoin    = 'miter';

        ctx.moveTo(0 , 0 );
        ctx.lineTo(CS, 0 );
        ctx.lineTo(CS, CS);
        ctx.lineTo(0 , CS);
        ctx.lineTo(0 , 0 );

        ctx.stroke();
        ctx.closePath();
    },
});

return MinimapView;
})();

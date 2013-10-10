var Timer = (function() {
function Timer(opts) {
    this.init(opts);
}

_.extend(Timer.prototype, {
    init: function(opts) {
        _.extend(this, opts);
        this.$timer = $('#timer');
        this.timerStart = util.now();
        this.previouslyElapsedTime = 0;
        this.paused = false;
    },
    start: function() {
        var self = this;
        self.paused = false;
        self.timerStart = util.now() + self.previouslyElapsedTime;
        self.intervalId = setInterval(function() {
            self.$timer.text(self.formattedTime());
        }, 500);
    },
    pause: function() {
        var self = this;
        self.paused = true;
        self.previouslyElapsedTime = util.now() - self.timerStart;
        clearInterval(self.intervalId);
    },
    formattedTime: function(a, b) {
        var floor = Math.floor;

        var msec, sec, min, hrs;

        var c;

        a = util.valueOrElse(a, this.timerStart);
        b = util.valueOrElse(b, util.now());
        c = this.previouslyElapsedTime;

        msec = c + (b - a);

        sec  = floor(msec / 1000);
        min  = floor(sec / 60);
        sec  = floor(sec % 60);
        hrs  = floor(min / 60);
        min  = floor(min % 60);

        sec = util.zeroPad(sec);
        if (hrs > 0) {
            this.$timer.addClass('hoursShowing');
            min = util.zeroPad(min);
            return '' + hrs + ':' + min + ':' + sec;
        }
        else {
            this.$timer.removeClass('hoursShowing');
            return min + ':' + sec;
        }

    },
});

return Timer;
})();

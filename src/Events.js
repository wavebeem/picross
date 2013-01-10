var Events = (function() {
function Events() {
    this.init();
}

_.extend(Events.prototype, {
    init: function() {
        this.handlers = {};
    },
    register: function(name, func) {
        if (this.handlers[name]) {
            this.handlers[name].push(func);
        }
        else {
            this.handlers[name] = [func];
        }
    },
    fire: function(name, data) {
        if (! this.handlers[name]) {
            return;
        }

        // console.warn('CALLING ' + name);

        _(this.handlers[name]).each(function(func) {
            func.call(undefined, data);
        });
    },
});
return Events;
})();

$('#content').hide();
WebFontConfig = {
    google: {
        families: [
            'Candal::latin',
            'Archivo+Black::latin',
        ]
    },
    active: function() {
        console.log('At least one font loaded');
        startGame({
            view: {
                fontBold: false,
            }
        });
    },
    inactive: function() {
        console.log('All fonts failed to load');
        startGame();
    },
};
(function() {
    var wf = document.createElement('script');
    wf.src = '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = true;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();

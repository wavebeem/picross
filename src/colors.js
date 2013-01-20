var colors = (function() {

var rgb       = util.rgb;
var rgba      = util.rgba;
var gray      = util.gray;
var alphaGray = util.alphaGray;
var hsl       = util.hsl;
var hsla      = util.hsla;

var yellow =  40;
var cyan   = 180;
var green  =  90;

return {
    highlight:      hsla(cyan, 0.3, 0.50, 1.00),
    cursorShadow:   hsla(cyan, 0.4, 0.40, 1.00),
    // cursorShadow:   alphaGray(0, 0.20),
    shadeCell:      alphaGray(0, 0.10),
    shadeLess:      alphaGray(0, 0.05),
    shadeLine:      alphaGray(0, 0.20),
    background:     hsl(yellow, 0.9, 0.93),
    // filled:         rgb(140, 190, 100),
    filled:         hsl(green, 0.4, 0.6),
    marked:         hsl(yellow, 0.6, 0.60),
    minorLines:     hsl(yellow, 0.8, 0.85),
    majorLines:     hsl(yellow, 0.7, 0.70),
    outsideBorder:  hsl(yellow, 0.5, 0.65),
    // insetShadow:    alphaGray(0, 0.05),
    insetShadow:    alphaGray(0, 0.40),
    hintsBG:        hsla(yellow, 0.6, 0.8, 0.55),
    hintsFade:      hsla(yellow, 0.6, 0.8, 0.00),
    shadow:         alphaGray(0,   0.25),
    light:          alphaGray(255, 0.75),
    shadowX:        alphaGray(0,   0.00),
    cellShade:      rgba(100, 110, 120, 0.05),
    fontNormal:     hsl(yellow, 0.3, 0.5),
};
})();

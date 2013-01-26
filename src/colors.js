var colors = (function() {

var rgb       = util.rgb;
var rgba      = util.rgba;
var gray      = util.gray;
var alphaGray = util.alphaGray;
var hsl       = util.hsl;
var hsla      = util.hsla;

var yellow  =  40;
var cyan    = 180;
var blue    = 220;
var purple  = 250;
var green   =  70;
var aqua    = 100;

// var hue1 = 200;
// var hue2 = (hue1 + 180 + 10) % 360;
// var hue3 = (hue1 + 180 - 10) % 360;

var hue1 = yellow;
var hue2 = blue;
var hue3 = purple;

return {
    highlight:      hsla(hue1, 0.6, 0.60, 1.00),
    cursorShadow:   hsla(hue1, 0.7, 0.40, 1.00),
    crosshair:      hsla(hue1, 0.4, 0.40, 0.10),
    crosshairShadow:hsla(hue1, 0.4, 0.40, 0.40),
    // cursorShadow:   alphaGray(0, 0.20),
    shadeCell:      alphaGray(0, 0.20),
    shadeLess:      alphaGray(0, 0.15),
    shadeLine:      alphaGray(0, 0.20),
    filled:         hsl(hue2, 0.4, 0.6),
    background:     hsl(hue2, 0.7, 0.97),
    marked:         hsl(hue2, 0.2, 0.60),
    minorLines:     hsl(hue2, 0.6, 0.90),
    majorLines:     hsl(hue2, 0.1, 0.60),
    outsideBorder:  hsl(hue2, 0.4, 0.75),
    // insetShadow:    alphaGray(0, 0.05),
    insetShadow:    alphaGray(0, 0.40),
    outerShadow:    hsla(hue1, 0.6, 0.3, 0.20),
    minimapBG:      hsl (hue1, 0.3, 0.95),
    innerShadow:    alphaGray(0, 0.20),
    hintsBG:        hsla(hue1, 0.4, 0.40, 0.10),
    hintsFade:      hsla(hue1, 0.4, 0.40, 0.00),
    shadow:         alphaGray(0,   0.25),
    light:          alphaGray(255, 0.75),
    lightBG:        alphaGray(255, 0.75),
    lightFade:      alphaGray(255, 0.00),
    shadeBG:        alphaGray(0,   0.06),
    shadeFade:      alphaGray(0,   0.00),
    shadowX:        alphaGray(0,   0.00),
    cellShade:      hsla(hue2, 0.9, 0.7, 0.10),
    fontNormal:     hsl(hue1,   0.1, 0.4),
    fontSelected:   hsl(hue1, 0.3, 0.3),
    fontStroke:     alphaGray(0, 0.25),
    // fontNormal:     hsl(yellow, 0.5, 0.4),
    // fontNormal:     alphaGray(0, 0.7),
};
})();

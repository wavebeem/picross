var colors = (function() {

var rgb       = util.rgb;
var rgba      = util.rgba;
var gray      = util.gray;
var alphaGray = util.alphaGray;
var hsl       = util.hsl;
var hsla      = util.hsla;

var yellow  =  40;
var cyan    = 160;
var blue    = 200;
var purple  = 250;
var green   =  70;
var aqua    = 100;

// var hue1 = 200;
// var hue2 = (hue1 + 180 + 10) % 360;
// var hue3 = (hue1 + 180 - 10) % 360;

var hue1 = yellow;
var hue2 = blue;
var hue3 = cyan;

return {
    highlight:      hsla(hue3, 0.5, 0.60, 0.75),
    cursorShadow:   hsla(hue3, 0.4, 0.40, 0.75),
    crosshair:      hsla(hue1, 0.4, 0.40, 0.10),
    crosshairShadow:hsla(hue1, 0.4, 0.40, 0.40),
    // cursorShadow:   alphaGray(0, 0.20),
    shadeCell:      alphaGray(0, 0.10),
    shadeLess:      alphaGray(0, 0.05),
    shadeLine:      alphaGray(0, 0.20),
    background:     hsl(hue2, 0.0, 0.97),
    checkerBG:      hsl(hue2, 0.0, 0.93),
    filled:         hsl(hue2, 0.0, 0.65),
    marked:         hsl(hue2, 0.5, 0.60),
    minorLines:     hsl(hue2, 0.0, 0.85),
    majorLines:     hsl(hue1, 0.7, 0.60),
    // outsideBorder:  hsl(hue2, 0.4, 0.75),
    outsideBorder:  hsl(hue2, 0.0, 0.70),
    insetShadow:    alphaGray(0, 0.00),
    // insetShadow:    alphaGray(0, 0.40),
    outerShadow:    hsla(0,    0.0, 0.3, 0.10),
    minimapBG:      hsl (0,    0.0, 0.93),
    innerShadow:    alphaGray(0, 0.20),
    hintsBG:        hsla(hue3, 0.70, 0.40, 0.20),
    hintsFade:      hsla(hue3, 0.70, 0.40, 0.00),
    hintsAltBG:     hsla(0, 0, 0.20, 0.08),
    hintsAltFade:   hsla(0, 0, 0.20, 0.00),
    shadow:         alphaGray(0,   0.25),
    light:          alphaGray(255, 0.75),
    lightBG:        alphaGray(255, 0.75),
    lightFade:      alphaGray(255, 0.00),
    shadeBG:        alphaGray(0,   0.06),
    shadeFade:      alphaGray(0,   0.00),
    shadowX:        alphaGray(0,   0.50),
    cellShade:      hsla(hue2, 0.9, 0.7, 0.10),
    fontNormal:     hsl(0, 0.0, 0.4),
    fontSelected:   hsl(0, 0.0, 0.3),
    fontStroke:     alphaGray(0, 0.25),
    // fontNormal:     hsl(yellow, 0.5, 0.4),
    // fontNormal:     alphaGray(0, 0.7),
};
})();

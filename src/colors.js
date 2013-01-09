var colors = (function() {

var rgb       = util.rgb;
var rgba      = util.rgba;
var gray      = util.gray;
var alphaGray = util.alphaGray;

var blue     = '#729fcf';
var darkBlue = '#3465a4';

return {
    highlight:  rgb(130, 140, 150),
    shadeCell:  alphaGray(0, 0.10),
    shadeLess:  alphaGray(0, 0.05),
    // shadeLine:  alphaGray(0, 0.25),
    // shadeLine:  alphaGray(0, 0.10),
    shadeLine:  alphaGray(0, 0.10),
    // shadeLine:  alphaGray(255, 0.99),
    // shadeLine:  'red',
    background: gray(250),
    // filled:     gray(187),
    filled:     rgb(190, 200, 210),
    marked:     gray(175),
    // minorLines: gray(240),
    minorLines: rgb(235, 235, 245),
    majorLines: gray(210),
    // majorLines: gray(240),
    hintsBG:    alphaGray(200, 0.25),
    hintsFade:  alphaGray(200, 0.00),
    shadow:     alphaGray(0,   0.25),
    // cellShade:  alphaGray(0,   0.05),
    cellShade:  rgba(0, 110, 220, 0.05),
};
})();

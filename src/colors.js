var colors = (function() {

var gray      = util.gray;
var alphaGray = util.alphaGray;

var blue     = '#729fcf';
var darkBlue = '#3465a4';

return {
    highlight:  darkBlue,
    shadow:     alphaGray(164, 0.75),
    shadeCell:  alphaGray(0, 0.08),
    shadeLess:  alphaGray(0, 0.04),
    // shadeLine:  alphaGray(0, 0.25),
    shadeLine:  alphaGray(0, 0.10),
    // shadeLine:  alphaGray(255, 0.99),
    // shadeLine:  'red',
    background: gray(250),
    filled:     gray(187),
    marked:     gray(175),
    minorLines: gray(240),
    majorLines: gray(210),
    // majorLines: gray(240),
    hintsBG:    alphaGray(200, 0.25),
    hintsFade:  alphaGray(200, 0.00),
    shadow:     alphaGray(0,   0.25),
};
})();

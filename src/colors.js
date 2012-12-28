var colors = (function() {

var gray      = util.gray;
var alphaGray = util.alphaGray;

var blue     = '#729fcf';
var darkBlue = '#3465a4';

return {
    highlight:  darkBlue,
    shadow:     alphaGray(164, 0.75),
    background: gray(250),
    filled:     gray(187),
    marked:     gray(175),
    majorLines: gray(210),
};
})();

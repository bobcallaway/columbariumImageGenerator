function getTextWidth(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

var max = <%= max %>;//for 7.5" square this appears to be a safe pixel max.
var defSize = <%= size %>; //default font size
var size = defSize;
while (getTextWidth("<%= lineString %>",size+"px Times New Roman") > max)
  size--;
if (size != defSize)//we made a change
  size -= ("<%= lineString %>".length / 7).toFixed();
console.log(size);
phantom.exit();

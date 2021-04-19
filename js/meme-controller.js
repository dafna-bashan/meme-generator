'use strict';

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    renderMeme();
}

function renderMeme() {
    var meme = getMeme();
    var lines = meme.lines;
    var img = new Image()
    img.src = `meme-imgs-square/${gMeme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        lines.forEach(function(line) {
            drawText(line.txt, line.pos.x, line.pos.y, line.size, line.align, line.fillColor, line.strokeColor, line.fontFamily);
            // console.log(gCtx.measureText(line.txt));
            if (lines.indexOf(line) === meme.selectedLineIdx) {
                drawBoundingBox(line);
            }
        })
    }
}


function renderButtons() {
    var meme = getMeme();
    document.querySelector('input[name=text]').value = meme.lines[meme.selectedLineIdx].txt;
    document.querySelector('select[name=font]').value = meme.lines[meme.selectedLineIdx].fontFamily;
    document.querySelector('input[name=stroke-color]').value = meme.lines[meme.selectedLineIdx].strokeColor;
    document.querySelector('input[name=fill-color]').value = meme.lines[meme.selectedLineIdx].fillColor;
}

function drawText(text, x, y, size, align, fillColor, strokeColor, fontFamily) {
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = fillColor;
    gCtx.font = `${size}px ${fontFamily}`;
    gCtx.textAlign = align;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}

function drawBoundingBox(currLine) {
    var measures = gCtx.measureText(currLine.txt);
    const height = 2 * (measures.actualBoundingBoxAscent + measures.actualBoundingBoxDescent);
    const width = measures.actualBoundingBoxRight + measures.actualBoundingBoxLeft + 40;
    const x = currLine.pos.x - (width / 2);
    const y = currLine.pos.y - (height / 1.4);
    gCtx.lineWidth = 1;
    gCtx.beginPath()
    gCtx.rect(x, y, width, height)
    gCtx.fillStyle = 'transparent'
    gCtx.fillRect(x, y, width, height)
    gCtx.strokeStyle = 'black'
    gCtx.stroke()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    // You may clear part of the canvas
    // gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height/4)
}

function onChangeLinePos(btnAction) {
    changeLinePos(btnAction);
    renderMeme();
}

function onUpdateImg(imgId) {
    updateImg(imgId);
    renderMeme();
}

function onUpdateText(elText) {
    updateText(elText);
    renderMeme();
}

function onChangeTextSize(btnAction) {
    changeTextSize(btnAction);
    renderMeme();
}

function onSwitchLines() {
    switchLines();
    renderButtons();
    renderMeme();
}

function onSetFont(fontFamily) {
    gCtx.font = "40px " + fontFamily;
    gCtx.fillText("text", 0, 8);
    setFont(fontFamily);
    renderMeme();
}

function onSetStrokeColor(color) {
    setStrokeColor(color);
    renderMeme();
}

function onSetFillColor(color) {
    setFillColor(color);
    renderMeme();
}

function onSetAlignText(alignTo) {
    setAlignText(alignTo);
    renderMeme();
}
// function _loadFont(fontname) {
//     var canvas = document.createElement("canvas");
//     //Setting the height and width is not really required
//     canvas.width = 16;
//     canvas.height = 16;
//     var ctx = canvas.getContext("2d");

//     //There is no need to attach the canvas anywhere,
//     //calling fillText is enough to make the browser load the active font

//     //If you have more than one custom font, you can just draw all of them here
//     ctx.font = "4px " + fontname;
//     ctx.fillText("text", 0, 8);
// }
'use strict';

var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    // resizeCanvas()
    // window.addEventListener('resize', function() {
    //     // gCanvas.width = window.innerWidth
    //     // gCanvas.height = window.innerHeight
    //     console.log(gCanvas.width, gCanvas.height);
    //     resizeCanvas()
    // })
    // resizeCanvas()
    addListeners();
    renderGallery();
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
    console.log(gCanvas.width, gCanvas.height);
}

function renderGallery() {
    document.querySelector('.gallery-container').style.display = 'grid';
    var imgs = getImgs();
    var imgsCards = imgs.map(function(img) {
        return `<div class="placeholder" data-id="${img.id}" onclick="onSelectImg(this.dataset.id)"><img src="${img.url}"></div>`
    }).join('');
    document.querySelector('.gallery-container').innerHTML = imgsCards;
}

function renderMeme(id) {
    // resizeCanvas()
    if (!id) {
        var meme = getMeme();
    } else {
        var meme = getMemeById(id);
    }
    var lines = meme.lines;
    var img = new Image()
    img.src = `meme-imgs-square/${meme.selectedImgId}.jpg`;
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
    document.querySelector('.share-container').innerHTML = '';
    document.querySelector('.share-container').style.display = 'none';
}

function renderSavedMemes() {
    document.querySelector('.edit-container').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'grid';
    var memes = getSavedMemes();
    var memesCards = memes.map(function(meme) {
        return `<div class="placeholder" data-id="${meme.selectedImgId}" onclick="onSelectMeme('${meme.id}')"><img src="./meme-imgs-square/${meme.selectedImgId}.jpg"></div>`
    }).join('');
    document.querySelector('.gallery-container').innerHTML = memesCards;

}

function onSaveMeme() {
    // gCtx.save();
    saveMeme();
}

function renderButtons() {
    var meme = getMeme();
    document.querySelector('input[name=text]').value = meme.lines[meme.selectedLineIdx].txt;
    document.querySelector('select[name=font]').value = meme.lines[meme.selectedLineIdx].fontFamily;
    document.querySelector('input[name=stroke-color]').value = meme.lines[meme.selectedLineIdx].strokeColor;
    document.querySelector('input[name=fill-color]').value = meme.lines[meme.selectedLineIdx].fillColor;
}

function drawText(text, x, y, size, align, fillColor, strokeColor, fontFamily) {
    // var textMetrics = gCtx.measureText(text);
    // if (textMetrics.width <= gCanvas.width) {
    //     document.querySelector('input[name=text]').disabled = 'false';
    // } else {
    //     document.querySelector('input[name=text]').disabled = 'true';
    // }
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = strokeColor;
    gCtx.fillStyle = fillColor;
    gCtx.font = `${size}px ${fontFamily}`;
    gCtx.textAlign = align;
    gCtx.fillText(text, x, y);
    gCtx.strokeText(text, x, y);
}


function drawBoundingBox(currLine) {
    var textMetrics = gCtx.measureText(currLine.txt);
    console.log(textMetrics);
    const x = currLine.pos.x;
    const y = currLine.pos.y;
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = 'black'
    gCtx.beginPath();
    gCtx.moveTo(
        x - textMetrics.actualBoundingBoxLeft,
        y - textMetrics.actualBoundingBoxAscent
    );
    gCtx.lineTo(
        x + textMetrics.actualBoundingBoxRight,
        y - textMetrics.actualBoundingBoxAscent
    );
    gCtx.lineTo(
        x + textMetrics.actualBoundingBoxRight,
        y + textMetrics.actualBoundingBoxDescent
    );
    gCtx.lineTo(
        x - textMetrics.actualBoundingBoxLeft,
        y + textMetrics.actualBoundingBoxDescent
    );
    gCtx.closePath();
    gCtx.stroke();
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

function onSelectMeme(id) {
    renderMeme(id);
    renderButtons();
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('.edit-container').style.display = 'flex';
}

function onSelectImg(imgId) {
    // updateImg(imgId);
    createMeme(imgId);
    console.log(imgId);
    renderMeme();
    renderButtons();
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('.edit-container').style.display = 'flex';
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

function onAddLine() {
    addLine();
    renderMeme();
}

function onRemoveLine() {
    removeLine();
    renderMeme();
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme';
}

function onCloseMeme() {
    document.querySelector('.gallery-container').style.display = 'grid';
    document.querySelector('.edit-container').style.display = 'none';
}


function toggleMenu() {
    document.body.classList.toggle('menu-open');
    document.querySelector('.main-nav a').classList.toggle('justify-content');
}

// ----------DRAG AND DROP----------

function getTexts() {
    var meme = getMeme();
    var texts = meme.lines;
    return texts;
}

var texts = getTexts();
var gStartPos;
var gSelectedText = -1;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        // resizeCanvas()
        renderMeme()
    })
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function isTextClicked(x, y, textIdx) {
    var text = texts[textIdx];
    text.width = gCtx.measureText(text.txt).width;
    text.height = 40;
    console.log(text.width, text.height);
    return (x >= text.pos.x - (text.width / 2) &&
        x <= text.pos.x + (text.width / 2) &&
        y >= text.pos.y - text.height &&
        y <= text.pos.y);
    // const { pos } = gSelected;
    // const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
    // return distance <= gCircle.size
}

function onDown(ev) {
    console.log('down');
    // gStartPos.x = parseInt(e.clientX - offsetX);
    // gStartPos.y = parseInt(e.clientY - offsetY);
    const pos = getEvPos(ev)
        // Put your mousedown stuff here
    for (var i = 0; i < texts.length; i++) {
        console.log(isTextClicked(pos.x, pos.y, i));
        if (isTextClicked(pos.x, pos.y, i)) {
            gSelectedText = i;
            updateSelectedLineIdx(gSelectedText);
            gStartPos = pos
            document.body.style.cursor = 'grabbing'
        }
    }
    // if (!isCirlceClicked(pos)) return
    // gSelected.isDragging = true


}


function onMove(ev) {
    console.log('move');
    if (gSelectedText >= 0) {
        const pos = getEvPos(ev)
        const dx = pos.x - gStartPos.x
        const dy = pos.y - gStartPos.y
        texts[gSelectedText].pos.x += dx
        texts[gSelectedText].pos.y += dy
        gStartPos = pos
        updateTextPosition(gStartPos)
        renderMeme()
    }
}

function onUp() {
    // gSelected.isDragging = false
    console.log('up');
    gSelectedText = -1
    document.body.style.cursor = 'grab'
}

// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container')
//     gCanvas.width = elContainer.offsetWidth
//     gCanvas.height = elContainer.offsetHeight
// }

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
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
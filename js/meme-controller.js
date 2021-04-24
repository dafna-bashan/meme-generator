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
    renderKeyWords();
}


function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
    console.log(gCanvas.width, gCanvas.height);
}

function renderGallery() {
    document.querySelector('.search input').hidden = false;
    document.querySelector('.memes').classList.remove('active');
    document.querySelector('.gallery').classList.add('active');
    document.querySelector('.edit-container').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'grid';
    // var imgs = getImgs();
    var imgs = filterImgs();
    var imgsCards = imgs.map(function(img) {
        return `<div class="placeholder" onclick="onSelectImg('${img.id}')"><img src="${img.url}"></div>`
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
    document.querySelector('.search input').hidden = true;
}

function renderSavedMemes() {
    document.querySelector('.search input').hidden = true;
    document.querySelector('.edit-container').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'grid';
    document.querySelector('.gallery').classList.remove('active');
    document.querySelector('.memes').classList.add('active');
    var memes = getSavedMemes();
    if (!memes || !memes.length) {
        var memesCards = `<h4>no saved memes yet</h4>`;
    } else {
        var memesCards = memes.map(function(meme) {
            return `<div class="placeholder">
            <button class="remove" onclick="onRemoveMeme('${meme.id}')">X</button><img src="${meme.imgUrl}" onclick="onSelectMeme('${meme.id}')"></div>`
        }).join('');
    }
    document.querySelector('.gallery-container').innerHTML = memesCards;

}

function onFilterImgs(keyWord) {
    setFilterImgs(keyWord);
    filterImgs(keyWord);
    renderGallery();
}

function renderKeyWords() {
    var keyWords = Object.keys(gKeywords).map(function(keyWord) {
        return `<option value="${keyWord}">`;

    }).join('');
    document.querySelector('#keywords').innerHTML = keyWords;
}

function onRemoveMeme(id) {
    removeMeme(id);
    renderSavedMemes();
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
    const textMetrics = gCtx.measureText(currLine.txt);
    // console.log(textMetrics);
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
    updateCurrMeme(id);
    renderMeme(id);
    renderButtons();
    document.querySelector('.gallery-container').style.display = 'none';
    document.querySelector('.edit-container').style.display = 'flex';
}

function onSelectImg(imgId) {
    createMeme(imgId);
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
    console.log(data);
    elLink.href = data;
    elLink.download = 'my-meme';
}

function onSaveMeme() {
    // gCtx.save();
    var image = gCanvas.toDataURL();
    saveMeme(image);
    // renderSavedMemes();  
}

function onCloseMeme() {
    document.querySelector('.edit-container').style.display = 'none';
    document.querySelector('.gallery-container').style.display = 'grid';
    if (document.querySelector('.gallery').classList.contains('active')) {
        renderGallery();
    } else {
        renderSavedMemes();
    }
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

var gTexts = getTexts();
var gStartPos;
var gSelectedIdx = -1;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function addListeners() {
    addMouseListeners()
    addTouchListeners()
        // window.addEventListener('resize', () => {
        //     // resizeCanvas()
        //     renderMeme()
        // })
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
    gTexts = getTexts();
    var text = gTexts[textIdx];
    console.log(text);
    var textMetrics = gCtx.measureText(text.txt);
    // text.width = gCtx.measureText(text.txt).width;
    // text.height = text.size;
    // console.log(width, height);
    return (x >= text.pos.x - textMetrics.actualBoundingBoxLeft &&
        x <= text.pos.x + textMetrics.actualBoundingBoxRight &&
        y >= text.pos.y - textMetrics.actualBoundingBoxAscent &&
        y <= text.pos.y + textMetrics.actualBoundingBoxDescent);

}

function onDown(ev) {
    gTexts = getTexts();
    const pos = getEvPos(ev);
    for (var i = 0; i < gTexts.length; i++) {
        console.log(isTextClicked(pos.x, pos.y, i));
        if (isTextClicked(pos.x, pos.y, i)) {
            gSelectedIdx = i;
            updateSelectedLineIdx(gSelectedIdx);
            console.log(gSelectedIdx);
            gStartPos = pos;
            document.body.style.cursor = 'grabbing';
            renderButtons();
        }
    }
}

function onMove(ev) {
    if (gSelectedIdx >= 0) {
        const pos = getEvPos(ev);
        var text = gTexts[gSelectedIdx];
        var textMetrics = gCtx.measureText(text.txt);
        if (text.pos.x - textMetrics.actualBoundingBoxLeft === 0 || text.pos.x + textMetrics.actualBoundingBoxRight === gCanvas.width ||
            text.pos.y - textMetrics.actualBoundingBoxAscent === 0 || text.pos.y + textMetrics.actualBoundingBoxDescent === gCanvas.height) {
            return;
        }
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        gTexts[gSelectedIdx].pos.x += dx;
        gTexts[gSelectedIdx].pos.y += dy;
        gStartPos = pos;
        renderMeme();
    }
}

function onUp() {
    gSelectedIdx = -1;
    document.body.style.cursor = 'grab';
}



function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault();
        ev = ev.changedTouches[0];
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos;
}

// function resizeCanvas() {
//     const elContainer = document.querySelector('.canvas-container')
//     gCanvas.width = elContainer.offsetWidth
//     gCanvas.height = elContainer.offsetHeight
// }

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
'use strict';

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];

// var gMeme = {
//     selectedImgId: 5,
//     selectedLineIdx: 0,
//     lines: [{ txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' }]
// };

var gMeme = createMeme(5);

function createMeme(selectedImgId) {
    return {
        selectedImgId,
        selectedLineIdx: 0,
        lines: [
            { txt: 'edit your text', size: 40, align: 'center', fillColor: 'white', strokeColor: 'black', fontFamily: 'impact', pos: { x: 200, y: 80 } },
            { txt: 'edit your text', size: 40, align: 'center', fillColor: 'white', strokeColor: 'black', fontFamily: 'impact', pos: { x: 200, y: 380 } }
        ]
    };
}

function getMeme() {
    return gMeme;
}

function updateText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
}

function updateImg(imgId) {
    gMeme.selectedImgId = imgId;
}

function changeTextSize(btnAction) {
    if (btnAction === 'decrease') {
        gMeme.lines[gMeme.selectedLineIdx].size--;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].size++;
    }
}

function changeLinePos(btnAction) {
    if (btnAction === 'down') {
        gMeme.lines[gMeme.selectedLineIdx].pos.y++;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].pos.y--;
    }
}

function switchLines() {
    if (gMeme.lines.length - 1 === gMeme.selectedLineIdx) {
        gMeme.selectedLineIdx = 0;
    } else {
        gMeme.selectedLineIdx++;
    }
}

function setFont(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily;
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color;
}

function setFillColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].fillColor = color;
}

function setAlignText(alignTo) {
    switch (alignTo) {
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].align = 'left';
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].align = 'center';
            break;
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].align = 'right';
            break;
        default:
            break;
    }
}
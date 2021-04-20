'use strict';

var STORAGE_KEY = 'Memes';
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = createImages();
var gMeme = createMeme(1);
var gSavedMemes = createMemes();

// var gMeme = {
//     selectedImgId: 5,
//     selectedLineIdx: 0,
//     lines: [{ txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' }]
// };

function createMemes() {
    var memes = loadFromStorage(STORAGE_KEY);
    if (!memes || !memes.length) {
        memes = [{
                id: makeId(),
                selectedImgId: 1,
                selectedLineIdx: 0,
                lines: [
                    { txt: 'my meme', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 250, y: 80 }, isDragging: false }
                ]
            },
            {
                id: makeId(),
                selectedImgId: 2,
                selectedLineIdx: 0,
                lines: [
                    { txt: 'my meme', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 250, y: 80 }, isDragging: false }
                ]
            }
        ];
        gSavedMemes = memes;
        _saveMemesToStorage();
    }
    return memes;
}

function createImages() {
    const imgs = [];
    for (let i = 0; i < 18; i++) {
        imgs.push({ id: i + 1, url: `meme-imgs-square/${i+1}.jpg`, keywords: ['happy'] })
    }
    return imgs;
}

function createMeme(selectedImgId) {
    const meme = {
        id: makeId(),
        selectedImgId,
        selectedLineIdx: 0,
        lines: [
            { txt: 'edit this text', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 250, y: 80 }, isDragging: false },
            { txt: 'edit this text', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 250, y: 450 }, isDragging: false }
        ]
    };
    gMeme = meme;
    return meme;
}

function getMeme() {
    return gMeme;
}

function getImgs() {
    return gImgs;
}

function getMemeById(memeId) {
    var meme = gSavedMemes.find(function(meme) {
        return memeId === meme.id;
    })
    return meme;
}

function getSavedMemes() {
    return gSavedMemes;
}

function _saveMemesToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes);
}

function updateText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
}

// function updateImg(imgId) {
//     gMeme.selectedImgId = imgId;
// }

function changeTextSize(btnAction) {
    if (btnAction === 'decrease') {
        gMeme.lines[gMeme.selectedLineIdx].size--;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].size++;
    }
}

function updateSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx;
}

function updateTextPosition(pos) {
    gMeme.lines[selectedLineIdx].txt.pos = pos;
}

function changeLinePos(btnAction) {
    if (btnAction === 'down') {
        gMeme.lines[gMeme.selectedLineIdx].pos.y += 5;
    } else {
        gMeme.lines[gMeme.selectedLineIdx].pos.y -= 5;
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
            gMeme.lines[gMeme.selectedLineIdx].align = 'end';
            // console.log('left');
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].align = 'center';
            // console.log('center');
            break;
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].align = 'start';
            // console.log('right');
            break;
            // default:
            //     break;
    }
}

function addLine() {
    var y;
    var spliceIdx;
    if (gMeme.lines.length === 0) {
        y = 80;
        spliceIdx = 0;
    } else if (gMeme.lines.length === 1) {
        y = 450;
        spliceIdx = 1;
    } else {
        y = 250;
        spliceIdx = 1;
    }
    gMeme.lines.splice(spliceIdx, 0, {
        txt: 'edit your text',
        size: 40,
        align: 'center',
        fillColor: '#ffffff',
        strokeColor: '#000000',
        fontFamily: 'impact',
        pos: { x: 250, y }
    })
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}


function saveMeme() {
    gSavedMemes.unshift(gMeme);
    _saveMemesToStorage();
}
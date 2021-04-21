'use strict';
var gFilterBy;
var STORAGE_KEY = 'Memes';
var gKeywords = {
    'happy': 12,
    'funny': 1,
    'angry': 4,
    'politics': 5,
    'animals': 7,
    'cute': 2,
    'baby': 1,
    'tired': 1,
    'victory': 1,
    'smile': 5,
    'kiss': 1,
    'sports': 2,
    'surprised': 1,
    'tough': 1,
    'mysterious': 1,
    'fear': 1
}
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
                imgUrl: `saved-meme-ex/2.png`,
                selectedImgId: 1,
                selectedLineIdx: 0,
                lines: [
                    { txt: 'my meme', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 250, y: 80 }, isDragging: false }
                ]
            },
            {
                id: makeId(),
                imgUrl: `saved-meme-ex/1.png`,
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
    // const imgs = [];
    // for (let i = 0; i < 18; i++) {
    //     imgs.push({ id: i + 1, url: `meme-imgs-square/${i+1}.jpg`, keywords: ['happy'] })
    // }
    var imgs = [
            { id: 1, url: `meme-imgs-square/1.jpg`, keywords: ['angry', 'politics'] },
            { id: 2, url: `meme-imgs-square/2.jpg`, keywords: ['animals', 'cute'] },
            { id: 3, url: `meme-imgs-square/3.jpg`, keywords: ['animals', 'cute', 'baby'] },
            { id: 4, url: `meme-imgs-square/4.jpg`, keywords: ['animals', 'cute', 'tired'] },
            { id: 5, url: `meme-imgs-square/5.jpg`, keywords: ['cute', 'baby', , 'victory'] },
            { id: 6, url: `meme-imgs-square/6.jpg`, keywords: ['happy', 'smile'] },
            { id: 7, url: `meme-imgs-square/7.jpg`, keywords: ['surprised', 'baby'] },
            { id: 8, url: `meme-imgs-square/8.jpg`, keywords: ['happy', 'smile'] },
            { id: 9, url: `meme-imgs-square/9.jpg`, keywords: ['funny', 'smile', , 'baby'] },
            { id: 10, url: `meme-imgs-square/10.jpg`, keywords: ['funny', 'smile', , 'politics'] },
            { id: 11, url: `meme-imgs-square/11.jpg`, keywords: ['kiss', 'funny', , 'sports'] },
            { id: 12, url: `meme-imgs-square/12.jpg`, keywords: ['surprised'] },
            { id: 13, url: `meme-imgs-square/13.jpg`, keywords: ['happy', 'smile'] },
            { id: 14, url: `meme-imgs-square/14.jpg`, keywords: ['tough', 'mysterious'] },
            { id: 15, url: `meme-imgs-square/15.jpg`, keywords: ['happy', 'smile'] },
            { id: 16, url: `meme-imgs-square/16.jpg`, keywords: ['happy', 'smile', 'funny'] },
            { id: 17, url: `meme-imgs-square/17.jpg`, keywords: ['politics', 'tough', 'victory'] },
            { id: 18, url: `meme-imgs-square/18.jpg`, keywords: ['smile', 'fear'] },
        ]
        // console.log(imgs);
    gImgs = imgs;
    return imgs;
}

function filterImgs() {
    if (!gFilterBy) return gImgs;
    var imgs = gImgs.filter(function(img) {
        return (img.keywords.join(',').search(gFilterBy) >= 0);
    })
    console.log(imgs);
    return imgs;
}

function setFilterImgs(keyword) {
    gFilterBy = keyword;
}

function createMeme(selectedImgId) {
    const meme = {
        id: makeId(),
        selectedImgId,
        selectedLineIdx: 0,
        lines: [
            { txt: 'edit this text', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 175, y: 60 }, isDragging: false },
            { txt: 'edit this text', size: 40, align: 'center', fillColor: '#ffffff', strokeColor: '#000000', fontFamily: 'impact', pos: { x: 175, y: 320 }, isDragging: false }
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

function updateCurrMeme(id) {
    gMeme = getMemeById(id);
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

function updateTextPosition(pos, selectedLineIdx) {
    gMeme.lines[selectedLineIdx].pos = pos;
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


function saveMeme(image) {
    gMeme.imgUrl = image;
    if (!getMemeById(gMeme.id)) {
        gSavedMemes.unshift(gMeme);
    }
    _saveMemesToStorage();
}

function removeMeme(id) {
    var meme = getMemeById(id);
    var idx = gSavedMemes.indexOf(meme)
    gSavedMemes.splice(idx, 1);
    _saveMemesToStorage();
}
'use strict';

var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{ txt: 'I never eat Falafel', size: 20, align: 'left', color: 'red' }]
};


function createMeme(selectedImgId) {
    return {
        selectedImgId,
        selectedLineIdx: 0,
        lines: [{ txt: 'edit your text', size: 20, align: 'center', color: 'black' }]
    };
}
'use strict'

// var listOfWords = [];
//var listOfSelectedWords = [];
var listOfSelectedWords = {};
// listOfSelectedWords.unshift('Original,Translate')

function createFile() {
    var fileName = document.getElementById('file-name').value.trim();
    var isTXT = document.getElementById('txt-file').checked;

    if (fileName == '') {
        alert('Вы не ввели название файла!');
        return;
    }

    fileName = fileName.split('.')[0];

    var a = document.getElementById('download-file');

    var delimiter = document.getElementById('delimiter').value;

    var content = Object.entries(listOfSelectedWords).filter((wordInfo) => wordInfo[1]).map((wordInfo) => wordInfo[0].replace(',', delimiter)).join('\n');

    content = `Original${delimiter}Translation${delimiter}Transcription${delimiter}Group\n` + content;

    var blob;
    var extension;

    if (isTXT) {
        blob = new Blob([content], {type: "text/plain"});
        extension = '.txt';
    } else {
        blob = new Blob(["\ufeff", content]);
        extension = '.csv';
    }

    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName + extension;
    // a.click();
}

function showHideWords(displayState) {
    var amountWords = document.getElementById('amount-words');
    var selectWordsBtn = document.getElementById('selectWordsBtn');
    var wordsTable = document.getElementById('words-table');

    amountWords.style.display = displayState;
    selectWordsBtn.style.display = displayState;
    wordsTable.style.display = displayState;

    if (displayState === 'none') {
        var totalWords = Object.keys(listOfSelectedWords).length;
        var totalSelectedWordsInput = document.querySelector('#amount-words');

        totalSelectedWordsInput.value = totalWords;
        selectWordsForSaveInFile(totalWords);
    }
}

function selectWordsForSaveInFile(totalWords, group = '') {
    var tableWithWords = document.querySelector('#words-table');
    var rows = tableWithWords.rows;
    var index = 0;
    var totalChecks = 0;

    for (var row of rows) {
        if (index === 0) {
            index++;
            continue;
        }

        var checkbox = row['cells'][0]['childNodes'][0];
        var wordState;
        var rowPattern = `${row['cells'][1]['childNodes'][0].innerHTML},${row['cells'][2]['childNodes'][0].innerHTML},${row['cells'][3]['childNodes'][0].innerHTML},${row['cells'][4]['childNodes'][0].innerHTML}`;

        if (group.length > 0) {
            wordState = rowPattern.split(',')[3] === (group === 'without_group' ? '' : group);
            totalChecks += wordState;
        } else {
            if (index <= totalWords)
                wordState = true;
            else
                wordState = false;
        }

        listOfSelectedWords[rowPattern] = wordState;
        checkbox.checked = wordState;
        index++;
    }

    if (group.length === 0)
        document.getElementById('groups-selector').selectedIndex = 0;

    return totalChecks;
}

function incrementDecrementSelectedWordsAmount(checkbox, rowPattern) {
    var totalSelectedWordsInput = document.querySelector('#amount-words');
    var totalSelectedWords = +totalSelectedWordsInput.value;

    if (checkbox.checked) {
        totalSelectedWords++;
        listOfSelectedWords[rowPattern] = true;
    } else {
        if (totalSelectedWords > 1) {
            totalSelectedWords--;
            listOfSelectedWords[rowPattern] = false;
        } else {
            checkbox.checked = true;
        }
    }

    totalSelectedWordsInput.value = totalSelectedWords;
}
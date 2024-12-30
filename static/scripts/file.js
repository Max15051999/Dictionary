var listOfWords = []
var listOfSelectedWords = []
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

    var content = listOfSelectedWords.join('\n');

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
}

function selectWordsForSaveInFile(totalWords) {
    var tableWithWords = document.querySelector('#words-table');
    var rows = tableWithWords.rows;
    var index = 0;

    listOfSelectedWords.length = 0;

    for (var row of rows) {
        var checkbox = document.getElementById(`words-ckbox_${index}`);
        var wordState;

        if (index + 1 <= totalWords) {
            wordState = true;
            listOfSelectedWords.push(listOfWords[index]);
        } else {
            wordState = false;
        }


        checkbox.checked = wordState;
        index++;
    }

    // console.log(listOfSelectedWords);
}

function changeDelimiter() {

}

function incrementDecrementSelectedWordsAmount(isIncrement, originalWord, translateWord) {
    var totalSelectedWordsInput = document.querySelector('#amount-words');
    var totalSelectedWords = +totalSelectedWordsInput.value;
    var delimiter = document.getElementById('delimiter').target.value;
    var rowPattern = `${originalWord}${delimiter}${translateWord}`;

    if (isIncrement) {
        totalSelectedWords++;
        listOfSelectedWords.push(rowPattern);
    } else {
        totalSelectedWords--;
        var index = listOfSelectedWords.indexOf(rowPattern);

        if (index !== -1)
            listOfSelectedWords.splice(index, 1);
    }


    totalSelectedWordsInput.value = totalSelectedWords;

    // console.log(listOfSelectedWords);
}
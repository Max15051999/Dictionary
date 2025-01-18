function changeLangs() {
    var firstLabel = document.getElementById('first-lang');
    var secondLabel = document.getElementById('second-lang');

    var inputTextarea = document.getElementById('original-input-word');
    var readTranslateTextarea = document.getElementById('read-translate');

    var firstLabelText = firstLabel.innerHTML;

    firstLabel.innerHTML = secondLabel.innerHTML;
    secondLabel.innerHTML = firstLabelText;

    var inputText = inputTextarea.value.trim();
    var translateText = readTranslateTextarea.value.trim();

    if (inputText != '' && translateText != '') {
        readTranslateTextarea.value = inputText;
        inputTextarea.value = translateText;
    }
}

function copyTextToClipBoard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied: ${text}`);
      /* Resolved - text copied to clipboard successfully */
    },() => {
      alert('Failed to copy');
      /* Rejected - text failed to copy to the clipboard */
    });
}

function checkTextareaInputText() {
    var inputText = document.getElementById('original-input-word').value.trim();

    if (inputText != '') {
        var firstLang = document.getElementById('first-lang').innerHTML;
        var secondLang = document.getElementById('second-lang').innerHTML;

        var service = document.getElementById('google').checked ? 'google' : 'wordhunt';
        window.location.href = `/translate/${inputText}/${firstLang}/${secondLang}/`;
    } else {
        alert('Введите слово для перевода');
    }
}

function addWordInDatabase() {
    var inputWord = document.getElementById('original-input-word').value.trim();
    var translatedWord = document.getElementById('read-translate').value.trim();
    var firstLang = document.getElementById('first-lang').innerHTML;
    var secondLang = document.getElementById('second-lang').innerHTML;

    if (inputWord != '' && translatedWord != '')
        window.location.href = `/add_new_word/${inputWord}/${translatedWord}/${firstLang}/${secondLang}/`
    else
        alert('Для добавления в словарь нужны оба слова')
}

function updateServiceForTranslate(service) {
    // var service = document.getElementById('google').checked ? 'google' : 'wordhunt';

    var firstLang = document.getElementById('first-lang').innerHTML;
    var secondLang = document.getElementById('second-lang').innerHTML;
    window.location.href = `/update_service/${service}/${firstLang}/${secondLang}/`;

//    if (document.getElementById('original-lang').target.value != 'EN') {
//        alert('Данный сервис может переводить слова только на английском языке!');
//        document.getElementById('google').checked = true;
//    } else {
//        var secondLang = document.getElementById('second-lang').innerHTML
//        window.location.href = `/update_service/${service}/${firstLang}/${secondLang}/`;
//    }
}

function setForeignLang(event) {
    var foreignLang = event.target.value;

    document.getElementById('first-lang').innerHTML = foreignLang;
    document.getElementById('second-lang').innerHTML = 'RU';

    var wordhuntBtn = document.getElementById('wordhunt');
    if (foreignLang != 'EN') {
        var service = wordhuntBtn.checked ? 'wordhunt' : 'google';

        document.getElementById('google').checked = true;
        wordhuntBtn.disabled = true;

        if (service != 'google') {
            updateServiceForTranslate('google');
        }

    } else {
        wordhuntBtn.disabled = false;
    }
}

function createDivsWithWords(listWords) {
    var elemDiv = document.createElement('div');
    elemDiv.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;';
    document.body.appendChild(elemDiv);
}

function setTotalWordsInDict(selectObj) {
    var lang = selectObj.options[selectObj.selectedIndex].text;
    window.location.href = `/guess_words/${lang}/`;
//    document.getElementById('total-dict-words').innerHTML = `Количество слов ${selectObj.value}`;
//
//    document.getElementById('original-lang-label').innerHTML = `С ${lang} на русский`;
//    document.getElementById('second-lang-label').innerHTML = `С русского на ${lang}`;
//
//    var totalWordsInput = document.getElementById('total-words');
//    totalWordsInput.value = selectObj.value;
//    totalWordsInput.max = selectObj.value;
}

function swapWords(word) {
    var englishWord = word.innerHTML;
    word.innerHTML = word.getAttribute('data-trans');
    word.setAttribute('data-trans', englishWord);
}

function deleteWord(wordId, wordEn = '', lang = '') {
    var msg = `Вы действительно хотите удалить слово ${wordEn}?`;
    var selectedWordIds = [];

    var currentUrl = window.location.href;

    if (wordId == 0) {
        // var wordCheckers = document.getElementsByClassName('word-checker');

        checkedWords.forEach((word, idx) => {
            if (word.checked)
                selectedWordIds.push([listWords[idx].id]);
        });

//        var idx = 0;
//        for (var wordChecker of wordCheckers) {
//            if (wordChecker.checked)
//                selectedWordIds.push([listWords[idx].id]);
//            idx++;
//        }

        if (selectedWordIds.length > 0)
            msg = 'Вы действительно хотите удалить выделенные слова?';
        else
            msg = 'Вы действительно хотите удалить все слова из словаря?';
    } else {
        selectedWordIds.push([wordId]);
    }

    // console.log(lang)

    if (confirm(msg)) {
        lang = lang == '' ? 'default' : lang;

        fetch(`/delete_word/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({wordIds: selectedWordIds, lang: lang})
        });

        setTimeout(() => {
            window.location.href = currentUrl;
        }, 50)
    }
}

function sayWord(word, lang) {
    try {
        // var lang = sessionStorage.getItem('source_lang').toLowerCase();
        // console.log(lang);
        var sp = new SpeechSynthesisUtterance();
        sp.lang = lang.toLowerCase();
        sp.text = word;
        speechSynthesis.speak(sp);
    } catch (e) {
        alert(`Не удалось произнести слово.\n${e}`);
    }
    // speechSynthesis.cancel();
}

function findWordCard() {
    var wordPart = searchInput.value.trim();

    if (wordPart != '') {
        var url = window.location.href;
        if (url.includes('search'))
            window.location.href = `../../search/${wordPart}/`;
        else
            window.location.href = `search/${wordPart}/`;
    }
}

function showHideListWords(btn) {
    var listWords = document.getElementById('list-words');
    var listWordsDisplay = listWords.style.display;

    if (listWordsDisplay == 'none') {
        btn.innerHTML = 'HIDE'
        listWords.style.display = 'block';
    } else {
        btn.innerHTML = 'SHOW'
        listWords.style.display = 'none';
    }
}

function setWordChecked(wordId) {
    // console.log('WORD ID: ' + wordId);

    function setWordVisibility(isVisible) {
        for (var wordInfo of listWords) {
            if (wordInfo.original == wordCheckbox.value)
                wordInfo.is_checked = isVisible;
        }
    }

    var wordCheckbox = document.getElementById(`word_${wordId}`);
    var totalWordsNumber = document.getElementById('total-words');
    var totalWords = +totalWordsNumber.value;

    if (wordCheckbox.checked) {
        wordCheckbox.checked = false;

        // listWords.splice(wordId, 1)
        listWords[wordId].is_checked = false;
        // setWordVisibility(wordId, false);

        if (totalWords == 1)
            wordCheckbox.checked = true;
        else
            totalWordsNumber.value = totalWordsNumber.value - 1;
    } else {
        var wordLabel = document.getElementById(`word_label_${wordId}`);

        wordCheckbox.checked = true;
        //listWords.splice(wordId, 0, [wordLabel.innerHTML, wordLabel.getAttribute('data-trans')])
        listWords[wordId].is_checked = true;
        // setWordVisibility(wordId, true);
        totalWordsNumber.value = totalWords + 1;
    }
    updateStorageListWords();
}

//if (sessionStorage.getItem('words') == null)
//    sessionStorage.words = JSON.stringify({words: []});

var listWords = [];
function addWordsToList(wordId = -1, wordEn, wordRu, _transcription, _lang, date, _is_forgotten, _id) {
    var _timestamp = new Date(date).getTime() / 1000;
    // console.log('TIMESTAMP: ' + timestamp);
    var wordInfo = {
        id: _id,
        original: wordEn,
        translate: wordRu,
        transcription: _transcription,
        lang: _lang,
        is_checked: true,
        is_wrong_answer: null,
        timestamp: _timestamp,
        is_forgotten: _is_forgotten
    };

    if (wordId != - 1)
        wordInfo.id = wordId;

    // listWords.push([wordEn, wordRu, true, timestamp]);
    listWords.push(wordInfo);
    // console.log(listWords)
}

function getFormattedDateString(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');

    var formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}

function sortWords(sortType = 'alphabet') {
    if (sortType == 'alphabet')
        listWords = listWords.sort((wordInfo, wordInfo2) => wordInfo.original[0].localeCompare(wordInfo2.original[0]));
    else
        listWords = listWords.sort((wordInfo, wordInfo2) => wordInfo2.timestamp - wordInfo.timestamp);

    // console.log(listWords);

    // console.log(wordDeleteImgs);

    for (var i = 0; i < wordOriginals.length; i++) {
        // Change onclick attribute to img tag
        var wordInfo = listWords[i];
        var original = wordInfo.original;
        var translate = wordInfo.translate;
        var transcription = wordInfo.transcription;
        var lang = wordInfo.lang;

        wordSayImgs[i].setAttribute('onclick', `sayWord('${original}', '${lang}');`)
        wordOriginals[i].innerHTML = original;
        wordOriginals[i].setAttribute('data-trans', translate);
        wordTranscriptions[i].innerHTML = transcription;

        var wordFormattedDate = getFormattedDateString(new Date(wordInfo.timestamp * 1000));
        wordDates[i].innerHTML = wordFormattedDate;

        // wordDeleteImgs[i].removeAttribute('onclick');
        wordDeleteImgs[i].setAttribute('onclick', `deleteWord(${wordInfo.id}, '${original}')`);

        // wordDeleteImgs[i].onclick = () => deleteWord(wordInfo.id, original);
        // wordDeleteImgs[i].title = 'HELL';
        wordChangeLinks[i].href = `${window.location.href}change/${wordInfo.id}/${original}/${translate}/${transcription ? transcription : 'ES'}/`;
    }
}

function clickOnGetWordsFromEndCheckbox(isChecked) {
    for (var i in listWords) {
        let word = listWords[i];

        if (word.is_checked) {
            // setWordChecked(index);
            document.getElementById(`word_${i}`).checked = false;
            listWords[i].is_checked = false;
        }
    }

    var totalWords = +document.getElementById('total-words').value;
    var startIndex = isChecked ? listWords.length - 1 : 0;

    for (var i = 0; i < totalWords; i++) {
        document.getElementById(`word_${startIndex}`).checked = true;
        listWords[startIndex].is_checked = true;

        startIndex = isChecked ? --startIndex : ++startIndex;
    }

//    if (isChecked) {
//        for (var i = lenListWords - 1; i >= 0; i--) {
//            document.getElementById(`word_${i}`).checked = true;
//            listWords[i].is_checked = true;
//        }
//    } else {
//        for (var i = 0; i < lenListWords; i++) {
//            document.getElementById(`word_${i}`).checked = true;
//            listWords[i].is_checked = true;
//        }
//    }
}

function wordsInputChange(input) {
    var totalWords = input.value;
    var listWordsChecked = listWords.filter(wordInfo => wordInfo.is_checked);
    var wordsLength = listWords.length;

    if (totalWords <= 0 || totalWords > wordsLength) {
        input.value = listWordsChecked.length;
    } else {
        if (document.getElementById('take-end').checked) {
            listWords = listWords.sort((wordInfo, wordInfo2) => wordInfo.timestamp - wordInfo2.timestamp);
            totalWords = wordsLength - totalWords;

            for (var i = wordsLength - 1; i >= 0; i--) {
                var state;

                if (i >= totalWords)
                    state = true;
                else
                    state = false;

                document.getElementById(`word_${i}`).checked = state;
                listWords[i].is_checked = state;
            }
            // console.log(listWords);
        } else {
            for (var i = 0; i < wordsLength; i++) {
                var state;

                if (i < totalWords)
                    state = true;
                else
                    state = false;

                document.getElementById(`word_${i}`).checked = state;
                listWords[i].is_checked = state;
            }
        }
    }
}

function updateStorageListWords(sourceLang = '', takeFromEnd = false) {
    sessionStorage.words = JSON.stringify({words: listWords});

    if (sourceLang)
        sessionStorage.setItem('source_lang', sourceLang);

    sessionStorage.setItem('take_from_end', takeFromEnd ? '1' : '0');
}

function startGame(foreignLang, is_forgotten=false) {
    var lang = document.getElementById('EN_RU').checked ? foreignLang : 'RU';

    if (is_forgotten) {

        var forgottenWords = listWords.filter(wordInfo => wordInfo.is_forgotten == 1);

        if (forgottenWords.length == 0) {
            alert('У Вас нет забывающихся слов');
            return;
        }

        listWords = forgottenWords;
        shuffle(listWords);
        updateStorageListWords(lang, false);
        window.location.href = window.location.href + 'game/';

    } else {
        var totalWords = +document.getElementById('total-words').value;

        if (totalWords <= 0 || totalWords > listWords.length) {
            alert('Задайте корректное количество слов');
        } else {
            var takeFromEnd = false;

            if (document.getElementById('take-end').checked && listWords.length > 1) {
                // listWords = listWords.reverse();
                takeFromEnd = true;
            }

            shuffle(listWords);
            listWords = listWords.filter(wordInfo => wordInfo.is_checked);
            updateStorageListWords(lang, takeFromEnd);
            // sessionStorage.allWords = JSON.stringify({allWords: listWords});
            window.location.href = window.location.href + 'game/';
        }
    }
}

function shuffle(listWords=null) {
    if (listWords == null) {
        try {
            listWords = JSON.parse(sessionStorage.getItem('words')).words;
        } catch(TypeError) {
            alert('Отсутствует список слов для игры');
            window.location.href = '..';
        }
    } else {
        if (listWords.length <= 2)
            return;

        var wordsLastIndex = listWords.length - 1;

        for (var i = 0; i <= wordsLastIndex; i++) {
            var randomIndex = i;

            while(randomIndex == i)
                randomIndex = Math.floor(Math.random() * wordsLastIndex + 1);

            var randomValue = listWords[randomIndex];
            listWords[randomIndex] = listWords[i];
            listWords[i] = randomValue;
        }
        updateStorageListWords();
    }
}

var wordIndex = 0;
function setOriginalWord(lang) {
    listWords = JSON.parse(sessionStorage.getItem('words')).words;
    // console.log(listWords);

    var wordInfo = listWords[wordIndex];

    originalWord.innerHTML = wordInfo[lang != 'RU' ? 'original' : 'translate'];
    // console.log(lang)
    transcriptionWord.innerHTML = wordInfo.transcription ? wordInfo.transcription : '';
}

//var rightAnswersCount = 0;
//var wrongAnswersCount = 0;
function checkTranslateWord() {
    listWords = JSON.parse(sessionStorage.getItem('words')).words;
    // var translateWordInput = document.getElementById('translate-input');
    var translateWordValue = translateWordInput.value.trim();
    var questionStatusImg = document.getElementById('question-status');

    if (translateWordValue != '') {
        translateWordValue = translateWordValue.charAt(0).toUpperCase() + translateWordValue.toLowerCase().slice(1);
        translateWordValue = translateWordValue.replace('ё', 'е');
        var sourceLang = sessionStorage.getItem('source_lang');
        var originalWord = listWords[wordIndex - 1][sourceLang == 'RU' ? 'original' : 'translate'];
        var wordVariants = originalWord.split(',');
        var rightAnswerLabel = document.getElementById('right-answer');

        var isAnswerRight = false;

        if (wordVariants.length > 1) {
            translateWordValue = translateWordValue.toLowerCase();

            for (var word of wordVariants) {
                if (word.toLowerCase().trim().replace('ё', 'е') == translateWordValue) {
                    isAnswerRight = true;
                    break;
                }
            }
        } else {
            isAnswerRight = translateWordValue == originalWord.replace('ё', 'е');
        }

        var imgUrl;

        rightAnswerLabel.innerHTML = originalWord;

        if (isAnswerRight) {
            // rightAnswersCount++;
//            console.log(wordIndex);
//            console.log('IS RIGHT:', listWords[wordIndex - 1].is_wrong_answer);
            if (listWords[wordIndex - 1].is_wrong_answer == null)
                listWords[wordIndex - 1].is_wrong_answer = false;
            // imgUrl = '/static/img/right_answer_icon.png';
            questionStatusImg.src = '/static/img/right_answer_icon.png';
        } else {
            // wrongAnswersCount++;
            // rightAnswerLabel.innerHTML = originalWord;
            // console.log(wordIndex)
            listWords[wordIndex - 1].is_wrong_answer = true;
            // imgUrl = '/static/img/wrong_answer_icon.png';
            questionStatusImg.src = '/static/img/wrong_answer_icon.png';
            translateWordInput.value = '';
            sessionStorage.words = JSON.stringify({words: listWords});
            return;
        }
        sessionStorage.words = JSON.stringify({words: listWords});
        // questionStatusImg.src = imgUrl;

        setTimeout(() => {
            rightAnswerLabel.innerHTML = '';
            if (wordIndex < listWords.length) {
                document.getElementById('current_total').innerHTML = `${wordIndex + 1}/${listWords.length}`;
                questionStatusImg.src = '/static/img/thinking_icon.png';
                setOriginalWord(sourceLang);
                wordIndex++;
                translateWordInput.value = '';
            } else {
                var rightAnswersCount = 0;

                listWords.forEach(word => !word.is_wrong_answer ? ++rightAnswersCount : rightAnswersCount);

                var wrongAnswersCount = listWords.length - rightAnswersCount;

                window.location.href = `${window.location.href}statistic/${wordIndex}/${rightAnswersCount}/${wrongAnswersCount}/`
                // sessionStorage.words = JSON.stringify({words: []});
            }
        }, 1000)
    } else {
        alert('Введите перевод слова');
    }
}

var isSaying = false;
var intervalId = null;
function startStopSayingAllWords() {
    var sayingWordsImg = document.getElementById('saying-words-img');

    if (!isSaying) {
        // var checkedWords = document.querySelectorAll('.word-checker');
        var wordsForSpeaking = [];

        checkedWords.forEach((checkedWord, idx) => {
            if (checkedWord.checked)
                wordsForSpeaking.push(listWords[idx]);
        });

        sayingWordsImg.src = '/static/img/stop_saying_words.png';
        isSaying = true;
        speakWords(0, sayingWordsImg, wordsForSpeaking.length > 0 ? wordsForSpeaking : listWords);
    } else {
        sayingWordsImg.src = '/static/img/start_saying_words.png';
        isSaying = false;
    }

//    if (!intervalId) {
//        sayingWordsImg.src = '/static/img/stop_saying_words.png'
//        intervalId = setInterval(() => {
//            if (wordIndex < listWords.length) {
//                var wordInfo = listWords[wordIndex];
//                sayWord(`${wordInfo.original}`, `${wordInfo.lang}`);
//                sayWord(`${wordInfo.translate}`, 'RU');
//                wordIndex++;
//                console.log('ITER');
//
//            } else {
//                sayingWordsImg.src = '/static/img/start_saying_words.png'
//                isWordsSaying = false;
//                clearInterval(intervalId);
//                intervalId = null;
//                wordIndex = 0;
//            }
//        }, 1000)
//    } else {
//        sayingWordsImg.src = '/static/img/start_saying_words.png'
//        isWordsSaying = false;
//        clearInterval(intervalId);
//        intervalId = null;
//        wordIndex = 0;
//    }
}

function speakWords(wordIndex, sayingWordsImg, words) {
    if (wordIndex < words.length) {
        var utterance = new SpeechSynthesisUtterance();
        var utterance2 = new SpeechSynthesisUtterance();

        var wordInfo = words[wordIndex];

        utterance.text = wordInfo.original;
        utterance.lang = wordInfo.lang;

        utterance.onend = function() {
            utterance2.onend = function() {
                if (!isSaying)
                    return;

                wordIndex++;
                speakWords(wordIndex, sayingWordsImg, words); // Call the function again for the next word
            }
        };

        speechSynthesis.speak(utterance);

        utterance2.text = wordInfo.translate;
        utterance2.lang = 'RU';
        speechSynthesis.speak(utterance2);
    } else {
        sayingWordsImg.src = '/static/img/start_saying_words.png';
        isSaying = false;
    }
}

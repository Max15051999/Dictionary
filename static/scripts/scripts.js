'use strict'

function changeLangs() {
    var firstLabel = document.getElementById('first-lang');
    var secondLabel = document.getElementById('second-lang');

    var inputTextarea = document.getElementById('original-input-word');
    var readTranslateTextarea = document.getElementById('read-translate');

    var firstLabelText = firstLabel.innerHTML;
    var firstLabelCode = firstLabel.getAttribute('data-code');

    firstLabel.innerHTML = secondLabel.innerHTML;
    firstLabel.setAttribute('data-code', secondLabel.getAttribute('data-code'))

    secondLabel.innerHTML = firstLabelText;
    secondLabel.setAttribute('data-code', firstLabelCode)

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
        var firstLang = document.getElementById('first-lang').getAttribute('data-code');
        var secondLang = document.getElementById('second-lang').getAttribute('data-code');

        var service = document.getElementById('google').checked ? 'google' : 'wordhunt';
        window.location.href = `/translate/${inputText}/${firstLang}/${secondLang}/`;
    } else {
        alert('Введите слово для перевода');
    }
}

function addWordInDatabase() {
    var inputWord = document.getElementById('original-input-word').value.trim();
    var translatedWord = document.getElementById('read-translate').value.trim();
    var firstLang = document.getElementById('first-lang').getAttribute('data-code');
    var secondLang = document.getElementById('second-lang').getAttribute('data-code');

    if (inputWord != '' && translatedWord != '')
        window.location.href = `/add_new_word/${inputWord}/${translatedWord}/${firstLang}/${secondLang}/`
    else
        alert('Для добавления в словарь нужны оба слова')
}

function updateServiceForTranslate(service) {
    // var service = document.getElementById('google').checked ? 'google' : 'wordhunt';

    var firstLang = document.getElementById('first-lang').getAttribute('data-code');
    var secondLang = document.getElementById('second-lang').getAttribute('data-code');
    window.location.href = `/update_service/${service}/${firstLang}/${secondLang}/`;

//    if (document.getElementById('original-lang').target.value != 'EN') {
//        alert('Данный сервис может переводить слова только на английском языке!');
//        document.getElementById('google').checked = true;
//    } else {
//        var secondLang = document.getElementById('second-lang').innerHTML
//        window.location.href = `/update_service/${service}/${firstLang}/${secondLang}/`;
//    }
}

function setForeignLang(event, showHideSpecSymFn, params) {
    var foreignLang = event.target;
    var langCode = foreignLang.options[foreignLang.selectedIndex].attributes.name.value;

    var firstLangLabel = document.getElementById('first-lang');
    firstLangLabel.innerHTML = foreignLang.value;
    firstLangLabel.setAttribute('data-code', langCode);

    var secondLang = document.getElementById('second-lang');

    secondLang.innerHTML = 'Русский';
    secondLang.setAttribute('data-code', 'RU');

    var wordhuntBtn = document.getElementById('wordhunt');

    if (langCode != 'EN') {
        var service = wordhuntBtn.checked ? 'wordhunt' : 'google';

        document.getElementById('google').checked = true;
        wordhuntBtn.disabled = true;

        if (service != 'google') {
            updateServiceForTranslate('google');
        }

    } else {
        wordhuntBtn.disabled = false;
    }

    showHideSpecSymFn(...params);
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

    if (wordId === 0) {
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

function deleteNote(noteId, noteTitle = '', lang = '') {
    var msg = `Вы действительно хотите удалить заметку ${noteTitle}?`;
    var selectedNoteIds = [];

    var currentUrl = window.location.href;

    if (noteId === 0) {
        // var wordCheckers = document.getElementsByClassName('word-checker');

        checkedNotes.forEach((note, idx) => {
            if (note.checked)
                selectedNoteIds.push([note.getAttribute('note_id')]);
        });

//        var idx = 0;
//        for (var wordChecker of wordCheckers) {
//            if (wordChecker.checked)
//                selectedWordIds.push([listWords[idx].id]);
//            idx++;
//        }

        if (selectedNoteIds.length > 0)
            msg = 'Вы действительно хотите удалить выделенные заметки?';
        else
            msg = 'Вы действительно хотите удалить все заметки из словаря?';
    } else {
        selectedNoteIds.push([noteId]);
    }

    // console.log(lang)

    if (confirm(msg)) {
        lang = lang == '' ? 'default' : lang;

        fetch(`/delete_note/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({noteIds: selectedNoteIds, lang: lang})
        });

        setTimeout(() => {
            window.location.href = currentUrl;
        }, 50)
    }
}

function sayWord(word, lang, rate=1) {
    try {
        // var lang = sessionStorage.getItem('source_lang').toLowerCase();
        // console.log(lang);
        var sp = new SpeechSynthesisUtterance();
        sp.lang = lang.toLowerCase();
        sp.text = word;
        sp.rate = rate;
        speechSynthesis.speak(sp);
    } catch (e) {
        alert(`Не удалось произнести слово.\n${e}`);
    }
    // speechSynthesis.cancel();
}

function findWordCard(cards, isWord) {
    function hasMatch(string, pattern) {
        return string.match(pattern);
    }

    var wordPart = searchInput.value.trim();

    var matchCards = new Set();

    wordPart = wordPart.toLowerCase();

    var i = 0;
    for (var card of cards) {
        var wordTag = card.getElementsByTagName('h2')[0];

        var originWord = wordTag.innerHTML.toLowerCase();

        var pattern = wordPart.length === 1 ? `^${wordPart}.*` : `.*${wordPart}.*`;

        if (hasMatch(originWord, pattern))
            matchCards.add(card);

        if (isWord) {
            var transWord = wordTag.getAttribute('data-trans').toLowerCase();

            if (hasMatch(transWord, pattern))
                matchCards.add(card);
        }

        card.style.display = '';


        (isWord ? checkedWords : checkedNotes)[i++].checked = false;
    }

    var len = matchCards.size;

    if (len === 0) {
        len = cards.length;
        alert('Совпадений не найдено!');

    } else if (len === 1) {
        len = cards.length;
        matchCards.values().next().value.scrollIntoView({behavior: 'smooth'});

    } else {
        for (var card of cards) {
            card.style.display = !matchCards.has(card) ? 'none' : 'block';
        }
    }

    searchInput.value = '';

    var totalWords = document.getElementById(isWord ? 'total-words' : 'total-notes');
    totalWords.innerHTML = totalWords.innerHTML.replace(/\(.*\)/, `(${len})`)
//        var url = window.location.href;
//        if (url.includes('search'))
//            window.location.href = `../../search/${wordPart}/`;
//        else
//            window.location.href = `search/${wordPart}/`;
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

    if (totalWordsNumber.value < 4) {
        cardsRbtn.checked = false;
        cardsRbtn.disabled = true;
        textRbtn.checked = true;
    } else {
        cardsRbtn.disabled = false;
    }
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

    listWords.forEach((wordInfo, i) => {
        // Change onclick attribute to img tag
        var original = wordInfo.original;
        var translate = wordInfo.translate;
        var transcription = wordInfo.transcription;
        var lang = wordInfo.lang;
        var wordCard = wordCards[i];

//        wordSayImgs[i].setAttribute('onclick', `sayWord("${original}", '${lang}');`)
//        wordOriginals[i].innerHTML = original;
//        wordOriginals[i].setAttribute('data-trans', translate);
//        wordTranscriptions[i].innerHTML = transcription;

        var wordFormattedDate = getFormattedDateString(new Date(wordInfo.timestamp * 1000));
        // wordDates[i].innerHTML = wordFormattedDate;

        // wordDeleteImgs[i].removeAttribute('onclick');
        // wordDeleteImgs[i].setAttribute('onclick', `deleteWord(${wordInfo.id}, "${original}")`);

        // wordDeleteImgs[i].onclick = () => deleteWord(wordInfo.id, original);
        // wordDeleteImgs[i].title = 'HELL';
        // wordChangeLinks[i].href = `${window.location.href}change/${wordInfo.id}/${original}/${translate}/${transcription ? transcription : 'ES'}/`;
        wordCard.getElementsByClassName('word-say')[0].setAttribute('onclick', `sayWord("${original}", '${lang}');`);
        wordCard.getElementsByClassName('word')[0].innerHTML = original;
        wordCard.getElementsByClassName('word')[0].setAttribute('data-trans', translate);
        wordCard.getElementsByClassName('transcription')[0].innerHTML = transcription;
        wordCard.getElementsByClassName('date-to-add')[0].innerHTML = wordFormattedDate;
        wordCard.getElementsByClassName('word-delete')[0].setAttribute('onclick', `deleteWord(${wordInfo.id}, "${original}")`);
        wordCard.getElementsByClassName('word-change')[0].href = `${window.location.href}change/${wordInfo.id}/${original}/${translate}/${transcription ? transcription : 'ES'}/`;
    });
}

function sortNotes(sortType = 'alphabet', notesList) {

    if (sortType == 'alphabet')
        notesList = notesList.sort((noteInfo, noteInfo2) => noteInfo['title'].localeCompare(noteInfo2['title']));
    else
        notesList = notesList.sort((noteInfo, noteInfo2) => noteInfo2['date_to_add'] - noteInfo['date_to_add']);

    notesList.forEach((noteInfo, i) => {
        var noteId = noteInfo['id'];
        var noteTitle = noteInfo['title'];
        var noteCard = noteCards[i];

        noteCard.getElementsByClassName('note-title')[0].href = `${window.location.href}show_note/${noteId}`;
        noteCard.getElementsByClassName('title')[0].innerHTML = noteTitle;
        noteCard.getElementsByClassName('date-to-add')[0].innerHTML = getFormattedDateString(new Date(noteInfo['date_to_add'] * 1000));
        noteCard.getElementsByClassName('note-delete')[0].setAttribute('onclick', `deleteNote(${noteId}, "${noteTitle}");`);
        noteCard.getElementsByClassName('note-change')[0].href = `${window.location.href}change_note/${noteId}`;

//        noteTitles[i].innerHTML = noteTitle;
//        noteDates[i].innerHTML = getFormattedDateString(new Date(noteInfo['date_to_add'] * 1000));
//        noteDeleteImgs[i].setAttribute('onclick', `deleteNote(${noteId}, "${noteTitle}");`);
//        noteChangeLinks[i].href = `${window.location.href}change_note/${noteId}`;
    });
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

    if (input.value < 4) {
        cardsRbtn.checked = false;
        cardsRbtn.disabled = true;
        textRbtn.checked = true;
    } else {
        cardsRbtn.disabled = false;
    }

}

function updateStorageListWords(sourceLang = '', takeFromEnd = false) {
    sessionStorage.words = JSON.stringify({words: listWords});

    if (sourceLang)
        sessionStorage.setItem('source_lang', sourceLang);

    sessionStorage.setItem('take_from_end', takeFromEnd ? '1' : '0');
}

function startGame(foreignLang, isForgotten=false, isDictation=false) {
    var lang = document.getElementById('EN_RU').checked ? foreignLang : 'RU';

    sessionStorage.isDictation = isDictation;
    lang = isDictation ? foreignLang : lang;

    if (isForgotten) {

        var forgottenWords = listWords.filter(wordInfo => wordInfo.is_forgotten == 1);
        var forgottenLen = forgottenWords.length;

        if (forgottenLen == 0) {
            alert('У Вас нет забывающихся слов');
            return;
        }

        if (document.getElementById('word-cards').checked && forgottenLen < 4) {
            alert(`Количество забывающихся слов: ${forgottenLen}.\nНужно минимум 4 слова чтобы начать игру с карточками.`)
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

    var isChecked = isDictation ? false : document.getElementById('word-cards').checked;

    sessionStorage.setItem('word_cards', isChecked)
    sessionStorage.setItem('btn_word_cards_checked', isChecked)
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


function setOriginalWord(lang) {
    listWords = JSON.parse(sessionStorage.getItem('words')).words;
    // console.log(listWords);

    var wordInfo = listWords[wordIndex];

    originalWord.innerHTML = wordInfo[lang != 'RU' ? 'original' : 'translate'];

    // console.log(originalWord.innerHTML)
    transcriptionWord.innerHTML = wordInfo.transcription ? wordInfo.transcription : '';
}

function changeForgottenWordsBtnState(wordIndex) {
    if (listWords[wordIndex].is_forgotten === 0) {
        btnForgottenAction.innerHTML = 'Добавить в забывающиеся';
        btnForgottenAction.onclick = () => updateForgotten(wordIndex, 1, this);
    } else {
        btnForgottenAction.innerHTML = 'Удалить из забывающихся';
        btnForgottenAction.onclick = () => updateForgotten(wordIndex, 0, this);
    }
}

//var rightAnswersCount = 0;
//var wrongAnswersCount = 0;
var wordIndex = 0;
var gameHtmlPage = '';
var gameScriptTagText = '';
function checkTranslateWord(checkBtn) {
    listWords = JSON.parse(sessionStorage.getItem('words')).words;
    // var translateWordInput = document.getElementById('translate-input');
    var translateWordValue = translateWordInput.value.trim();
    var questionStatusImg = document.getElementById('question-status');

    if (translateWordValue != '') {
        // translateWordValue = translateWordValue.charAt(0).toUpperCase() + translateWordValue.toLowerCase().slice(1);

        function replaceSpecialSyms(string) {
            var splSyms = {
                'ё': 'е',
                'ä': 'ae',
                'ö': 'oe',
                'ü': 'ue',
                'ß': 'ss',
            }

            for (var [key, value] of Object.entries(splSyms))
                string = string.replaceAll(key, value);

            string = string.replaceAll(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F]/g, '');

            return string;
        }

        translateWordValue = translateWordValue.toLocaleLowerCase();
        translateWordValue = replaceSpecialSyms(translateWordValue);

        var sourceLang = sessionStorage.getItem('source_lang');

        var currentWord = listWords[wordIndex - 1];

        var answer = currentWord[sourceLang === 'RU' || isDictation ? 'original' : 'translate'].trim();

        var rightAnswerLabel = document.getElementById('right-answer');

        var isAnswerRight = false;

        var wordVariants = answer.split(',');
        if (wordVariants.length > 1 && wordCards != 'true') {
            // translateWordValue = translateWordValue.toLowerCase();

            for (var word of wordVariants) {
                if (replaceSpecialSyms(word.toLocaleLowerCase().trim()) === translateWordValue) {
                    isAnswerRight = true;
                    break;
                }
            }
        } else {
            isAnswerRight = translateWordValue === replaceSpecialSyms(answer.toLocaleLowerCase());
        }

        var imgUrl;

        if (isDictation)
            answer += ` (${currentWord['translate']})`;

        rightAnswerLabel.innerHTML = answer;

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
            // rightAnswerLabel.innerHTML = answer;
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

        checkBtn.disabled = true;

        setTimeout(() => {
            rightAnswerLabel.innerHTML = '';
            if (wordIndex < listWords.length) {
                document.getElementById('current_total').innerHTML = `${wordIndex + 1}/${listWords.length}`;
                questionStatusImg.src = '/static/img/thinking_icon.png';
                setOriginalWord(sourceLang);
                translateWordInput.value = '';

                if (wordCards === 'true') {
                    var idx = 0;
                    for (var variantWord of originTrans[`${wordIndex}_${originalWord.innerHTML}`]) {
                        cards[idx].innerHTML = variantWord;
                        setWordCardStyle(cards[idx], '5px solid DarkCyan', '50%', '25%');
                        idx++;
                    }
                    wordCardIndex = -1;
                }

                changeForgottenWordsBtnState(wordIndex);

                wordIndex++;

                if (sayWordsAutomaticallyCheckbox.checked || isDictation)
                    sayWord(`${originalWord.innerHTML}`, sourceLang);

            } else {
                var rightAnswersCount = 0;

                var cloneBody = document.body.cloneNode(true);
                document.body.parentNode.replaceChild(cloneBody, document.body);

                wordIndex = 0;

                listWords.forEach(word => !word.is_wrong_answer ? ++rightAnswersCount : rightAnswersCount);

                var wrongAnswersCount = listWords.length - rightAnswersCount;

                var langName = document.getElementById('lang-name').innerHTML;

                if (gameScriptTagText === '')
                    gameScriptTagText = document.getElementById('main-script').textContent;

                document.body.innerHTML = `
                        <div class="container">
                            <input id="white" type="radio" value="white" name="theme" onclick="changeTheme('white');">
                            <label for="white">Светлая</label>
                            <input id="black" type="radio" value="black" name="theme" onclick="changeTheme('black');" checked>
                            <label for="black">Тёмная</label><br>
                            <a style="color: red;" href="/">В начало</a>
                            <h1>Статистика игры в слова на ${langName}</h1>
                            <hr><br><br><br>

                            <input type="radio" id="EN_RU" name="from_to" onclick="sessionStorage.setItem('source_lang', '${langCode}');" checked>
                            <label id="original-lang-label" for="EN_RU">С ${langName.endsWith('ом') ? langName.slice(0, langName.length - 2) + 'ого' : langName} на Русский</label>
                            <br><br>
                            <input type="radio" id="RU_EN" name="from_to" onclick="sessionStorage.setItem('source_lang', 'RU');">
                            <label id="second-lang-label" for="RU_EN">С Русского на ${langName.endsWith('ом') ? langName.slice(0, langName.length - 2) + 'ий' : langName}</label>
                            <br><br><br>

                            <table id="statistic-table">
                                <tr>
                                    <td>Всего вопросов</td>
                                    <td>${listWords.length}</td>
                                </tr>
                                <tr>
                                    <td>Отвечено верно</td>
                                    <td>${rightAnswersCount}</td>
                                </tr>
                                <tr>
                                    <td id="wrong-ans">Отвечено неверно</td>
                                    <td>${wrongAnswersCount}</td>
                                </tr>
                                <tr>
                                    <td>Процент</td>
                                    <td>${((rightAnswersCount * 100) / listWords.length).toFixed(2)}%</td>
                                </tr>
                            </table>
                            <hr><br><br><br>
                            <button onclick="restartGame(true);" title="Нажмите <Enter>">Начать заново</button><br><br>

                            <button title="Нажмите Q" onclick="back();">Назад</button>
                        </div>
                `;

                var statisticScriptTag = document.createElement('script');

                // document.body.appendChild(tag);
                statisticScriptTag.textContent = `
                        if (sourceLang === 'RU')
                            document.getElementById('RU_EN').checked = true;

                        var listWords = JSON.parse(sessionStorage.getItem('words')).words;

                        function back() {
                            window.location.href = '../';
                        }

                        function restartGame(withAllWords) {
                            if (withAllWords) {
                                var copyWords = JSON.parse(sessionStorage.getItem('copyWords')).copy_words;

                                if (copyWords.length > 0)
                                    listWords = copyWords;
                            }

                            var len = listWords.length;

                            if (sessionStorage.getItem('btn_word_cards_checked') === 'true') {
                                sessionStorage.setItem('word_cards', len >= 4);
                                wordCards = len >= 4 && !isDictation ? 'true' : 'false';
                            }

                            for (var i = len - 1; i >= 0; i--)
                                listWords[i].is_wrong_answer = null;

                            sessionStorage.words = JSON.stringify({words: listWords});

                            // window.location.href = '../../../../';

                            var tag = document.createElement('script');
                            tag.setAttribute('id', 'main-script');

                            tag.textContent = \`${gameScriptTagText}\`;

                            document.body.innerHTML = \`${gameHtmlPage}\`;

                            document.body.appendChild(tag);

                        }

                        var wrongAnswers = document.getElementById('wrong-ans');

                        if (${wrongAnswersCount} > 0) {
                            // listWords = JSON.parse(sessionStorage.getItem('words')).words;

                            wrongAnswers.style.color = 'Red';
                            wrongAnswers.style.cursor = 'pointer';
                            wrongAnswers.title = 'Повторить с этими словами';
                            wrongAnswers.onclick = () => {
                                if (JSON.parse(sessionStorage.getItem('copyWords')).copy_words.length == 0)
                                    sessionStorage.copyWords = JSON.stringify({copy_words: listWords});

                                listWords = listWords.filter(wordInfo => wordInfo.is_wrong_answer);

                                restartGame(false);
                                // sessionStorage.words = JSON.stringify({words: listWords});
                                // window.location.href = '../../../../';
                            }
                        } else {
                            wrongAnswers.style.color = 'Green';
                        }

                        document.body.addEventListener('keydown', function setStatActions(event) {
                            console.log('KEYDOWN')
                            switch(event.code) {
                                case 'Enter':
                                    restartGame(true);
                                    break;
                                case 'KeyQ':
                                    back();
                                    break;
                                default:
                                    return;
                            };

                            }, {once: true});
                `;

                document.body.appendChild(statisticScriptTag);

            }
            checkBtn.disabled = false;
        }, 1000)
    } else {
        alert('Введите перевод слова');
    }
}

function updateForgotten(wordIndex, actionType, actionBtn) {
    if (navigator.onLine) {
        var word = listWords[wordIndex];

        word.is_forgotten = actionType;
        sessionStorage.words = JSON.stringify({words: listWords});

        fetch('.', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({wrongId: word.id, actionType: actionType})
        });

        if (actionType === 1) {

            btnForgottenAction.innerHTML = 'Удалить из забывающихся';

            alert(`Слово "${word.original}" добавлено в список забывающихся`);
        } else {
            btnForgottenAction.innerHTML = 'Добавить в забывающиеся';

            alert(`Слово "${word.original}" удалено из списка забывающихся`);
        }

        changeForgottenWordsBtnState(wordIndex);

    } else {
        var msg = ' забывающихся нужен интернет';
        msg = (actionType === 1 ? 'Для добавления данного слова в список' : 'Для удаления данного слова из списка') + msg;

        alert(msg);
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
            if (checkedWord.checked || checkedWord.parentNode.parentNode.style.display === 'block')
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

var utterance = new SpeechSynthesisUtterance();
var utterance2 = new SpeechSynthesisUtterance();
function speakWords(wordIndex, sayingWordsImg, words) {
    if (wordIndex < words.length) {
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

'use strict'

function addSpecialSymbolInInput(elem) {
    var symbol = elem.textContent || elem.innerText;
    document.getElementById('original-input-word').value += symbol;
}

function showHideSpecialSymbols() {
    var divWithSpecialSymbols = document.getElementById('special-symbols');

    if (divWithSpecialSymbols.style.display == 'none')
        divWithSpecialSymbols.style.display = 'flex';
    else
        divWithSpecialSymbols.style.display = 'none';
}
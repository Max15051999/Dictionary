'use strict'

function addSpecialSymbolInInput(elem) {
    var symbol = elem.textContent || elem.innerText;

    try {
        document.getElementById('original-input-word').value += symbol;
    } catch (TypeError) {
        navigator.clipboard.writeText(symbol).then(() => {
          /* Resolved - text copied to clipboard successfully */
        },() => {
          alert(`Failed to copy ${symbol}`);
          /* Rejected - text failed to copy to the clipboard */
        });
    }
}

function showHideSpecialSymbols() {
    var divWithSpecialSymbols = document.getElementById('special-symbols');

    if (divWithSpecialSymbols.style.display == 'none')
        divWithSpecialSymbols.style.display = 'flex';
    else
        divWithSpecialSymbols.style.display = 'none';
}

function showHideSpecialSymbolsBtn(lang, specialSymbolsBtn, specialSymbols) {
    var visible = 'hidden';

    switch (lang) {
        case 'DE':
        case 'UK':
            visible = 'visible';
            for (var btn of specialSymbols.children)
                btn.style.display = lang === btn.className ? 'block' : 'none';
            break;
    }

    specialSymbolsBtn.style.visibility = visible;
    specialSymbols.style.visibility = visible;
}
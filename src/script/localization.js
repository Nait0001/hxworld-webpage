import {connectSignal, emmitSignal} from './utils.js';

let inputLang = document.getElementById('language-list')
const DEFAULT_LANG = "en"

if (!localStorage.getItem('lang')) localStorage.setItem('lang', DEFAULT_LANG)

export var languageJson = null
export var curLanguage = (localStorage.getItem('lang')) ? localStorage.getItem('lang') : DEFAULT_LANG
inputLang.value = curLanguage   


inputLang.addEventListener('click', (value)=>{
    if (curLanguage != inputLang.value)
    {
        curLanguage = inputLang.value
        localStorage.setItem('lang', curLanguage)
        location.reload(true)
    }
})

async function getLanguageJson(lang = "pt-br")
{
    const DATA = await fetch(`./src/data/localization/${lang}.json`);
    const JSON = await DATA.json()

    return JSON
}

getLanguageJson(curLanguage).then(res => {
    let elementsLang = document.body.getElementsByClassName("lang")
    document.body.classList.remove('loaded')
    languageJson = res

    for (const i in elementsLang)
    {
        let curElement = elementsLang[i];
        let curText = res[curElement.innerHTML]
        if (curText){
            if (curText instanceof Array) {
                if (curElement.tagName.toLowerCase() == 'ul') {
                    curElement.innerHTML = ''
                    for (const j in curText) curElement.innerHTML += `<li>${curText[j]}</li>`
                }

                else curElement.innerHTML = curText.join('<br>')
            }

            else curElement.innerHTML = curText
        }
    }

    
    document.body.classList.add('loaded')
    emmitSignal('loaded')
})
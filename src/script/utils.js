export const language = document.documentElement.lang 

// Alert
let alertItens = []
let alertGroup = document.getElementById('alerts')
const ALERT_TIME = 3


// If my message starts with $ then search the messages list
export function spawnAlert(message, type = 'alert')
{
    console.log(message);
    let alertDiv = document.createElement('div')
    alertDiv.className = 'alert';

    let alertWord = document.createTextNode(getAlertText(message))

    alertDiv.appendChild(alertWord)
    alertGroup.appendChild(alertDiv)

    alertItens = document.getElementsByClassName('alert')

    
    // alertDiv.style.animation = "slide 1s ease-out";
    const anim = alertDiv.animate([
        {transform: 'translateX(100vw)', opacity: '0'},
        {transform: 'translateX(0vw)', opacity: '1'}
    ], {duration: 1000, easing: 'ease-out'})

    anim.finished.then((_)=>{
        setTimeout(function(_) {
            if (alertDiv){
                anim.reverse()
                anim.finished.then(()=> {alertGroup.removeChild(alertDiv)})
            }

        }, ALERT_TIME * 1000);
    })
}

function getAlertText(command)
{
    if (command.includes('$'))
    {
        command = command.replace('$', "")
        switch(command)
        {
            case 'error:status':
                if (language === 'pt-br')
                {
                    return 'Opa! parece que algum erro aconteceu em relacao na atualizacao do estado da commision, por favor atualize a pagina'
                }
                return 'Testo sexual'
            case '$error:generic':
                if (language === 'pt-br')
                {
                    return "Opa! Aconteceu algum erro, nao sabemos onde veio, atualize a pagina para conserta-lo, talvez"
                }
            default:
                return command
        }
    }
    
    return command
}
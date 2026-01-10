import {spawnAlert} from './utils.js';

const COMMISSION_STATE = {
    CLOSED: 0,
    OPEN: 1,
    FULL: 2,
    ERROR: 3,
    WAIT: 4,
}

var commState = COMMISSION_STATE.WAIT; 
let statusText = document.getElementById("status")

const PATH = 'https://trello.com/b/j04AXmnd.json'
const LIST_NAME = ['To do', 'Working']
// 'https://trello.com/b/j04AXmnd.json'


async function getList(ignoreArchiveCard = true)
{
    try 
    {
        const RESPONSE = await fetch(PATH);
        const DATA = await RESPONSE.json();

        const CARDS_DATA = DATA.cards;
        const LIST_DATA = DATA.lists;

        let LIST_ID = [];
        let TASK_LIST = [];
        let commMax = 0;


        for (let list in LIST_DATA)
        {
            var curList = LIST_DATA[list];
            for (let i in LIST_NAME)
            {
                let listDataName = LIST_NAME[i];
                let filterName = curList.name.replace(/\((.+?)\)/gi, "").trim();
                let commands = curList.name.match(/\((.+?)\)/gi);

                if (commands !== null && commands[0] !== null)
                {
                    commMax = commands[0].match(/(\d+)/g).map(Number)[0];
                }

                if (filterName === listDataName.trim()) LIST_ID.push({id: curList.id, name: curList.name});
            }
        }

        // console.log(LIST_ID);

        for (let card in CARDS_DATA)
        {
            var curCard = CARDS_DATA[card];
            for (let i in LIST_ID)
            {
                if (curCard.idList === LIST_ID[i].id && (!curCard.closed || !ignoreArchiveCard)) 
                    TASK_LIST.push({card: curCard.name, list: LIST_ID[i].name});
            }
        }

        return {
            status: 'OK',
            log: 'Succes Loaded!',
            maxCommission: commMax,
            tasks: TASK_LIST,
        }
    }
    catch (error)
    {

        // console.log(error);
        
        return {
            status: 'ERROR',
            log: error,
            maxCommission: 0,
            tasks: []
        }

    }
}
 
getList().then(res => {
    let maxT = res.tasks.length;
    let maxC = res.maxCommission;

    // If happen any error, the state return ERROR
    // If MAX COMMISSION is > 0 then commission are CLOSED
    // If MAX TASK is >= MAX COMMISSION then commission are FULL ex: 10/10
    // If any theses conditions nothing happen, then commission are OPEN ex: 1/5

    commState = (res.status === 'OK')
    ?(maxC > 0) 
        ?(maxT >= maxC)
        ?COMMISSION_STATE.FULL
        :COMMISSION_STATE.OPEN
        :COMMISSION_STATE.CLOSED
    :
        COMMISSION_STATE.ERROR
    
    // console.log(commState)
    // spawnAlert("$error:status", 'ERROR')
    switch(commState)
    {
        case COMMISSION_STATE.OPEN:
            statusText.innerText = `OPEN ${maxT}/${maxC}`;
            break;
        case COMMISSION_STATE.CLOSED:
            statusText.innerText = "CLOSED";
            break;
        case COMMISSION_STATE.FULL:
            statusText.innerText = `FULL ${maxC}/${maxC}`;
            break;
        case COMMISSION_STATE.ERROR:
            statusText.innerText = ':/ Error'
            
            spawnAlert("$error:status", 'ERROR')
            break;
        default:
            spawnAlert("$error:generic", 'ERROR')
    }
});



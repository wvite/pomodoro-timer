// for popup display
let appData, timerOn = null, bgPage;

const init = async () => {
    await getBgPage();
    await renderPopup();
    document.querySelector('.close').addEventListener('click', deleteCurrentTask);
    document.querySelector('.add').addEventListener('click', addTask );
    document.querySelector('#btn-start').addEventListener('click', startTimer);
    document.querySelector('#btn-stop').addEventListener('click', stopTimer);
    document.querySelector('.task-list').addEventListener('click', deleteTask);
};

const getBgPage = () => {
    return new Promise((resolve) => {
        chrome.runtime.getBackgroundPage(window => {
            bgPage = window;
            resolve();
        })
    });
};

const renderPopup = async () => {
    if(!appData) {
        const load = await loadLocalData();
    }

    const tasks = appData.tasks;
    const taskList = document.querySelector('.task-list');

    taskList.innerHTML = '';

    if(!appData.tasks) tasks = appData.tasks = [];
    if (tasks.length === 0) {
        setTaskIntoTimerDisplay();
    } else if (tasks.length === 1) {
        setTaskIntoTimerDisplay(tasks[0]);
    } else {
        setTaskIntoTimerDisplay(tasks[0]);
        tasks.slice(1).map(el => {
            taskList.insertAdjacentHTML('beforeend',`
                <div class="task ${el.type}" id="${el.id}">
                <span class="task-name">${el.name}</span>
                <span class="task-delete">
                    <img class="trash" src="icons/times-solid.svg"/>
                </span>
                <span class="task-time">${Math.floor(el.time / 60000)} min</span>
            </div>`);
        });
    }
};

const loadLocalData = () => {
    return new Promise((resolve) => {
       chrome.storage.local.get(['pomodoro_timer'], (result) => {
            if(result.pomodoro_timer) {
                resolve(result.pomodoro_timer);
            } else {
                resolve({ tasks: [] });
            }
       }); 
    }).then(data => {
        appData = mapObject(data);
    });
};

const saveLocalData = () => chrome.storage.local.set({ pomodoro_timer: appData});

const deleteCurrentTask = () => {
    if(appData.tasks.length > 0) {
        stopTimer();
        appData.tasks.shift();
        saveLocalData();
        renderPopup();
    }
};

const addTask = () => {
    appData.tasks.push({
        id: createUniqueID(),
        type: 'work',
        name: 'work',
        time: 1500000
    });
    appData.tasks.push({
        id: createUniqueID(),
        type: 'break',
        name: 'break',
        time: 300000
    });
    saveLocalData();
    renderPopup();
};

const deleteTask = () => {
    if(event.target.className === 'trash') {
        const taskElement = event.target.parentElement.parentElement;
        appData.tasks = appData.tasks.filter(el => el.id !== taskElement.id);
        saveLocalData();
        taskElement.remove();
    }
};

const startTimer = () => {
    if(!timerOn && appData.tasks.length > 0){
        bgPage.startTimer(appData.tasks[0]);
        timerOn = setTimeout(updateTimerDisplay, 800);
    }
};

const stopTimer = () => {
    if(timerOn) {
        bgPage.stopTimer();
        clearTimeout(timerOn);
        timerOn = null;
        appData.tasks[0].time = bgPage.getRemainingTime(false);
    }
};

const updateTimerDisplay = () => {
    const remain = bgPage.getRemainingTime(false);
    if(remain && remain > 0) {
        timerDisplay(bgPage.getRemainingTime());
        if(timerOn) {
            timerOn = setTimeout(updateTimerDisplay, 1000);
        }
    } else {
        deleteCurrentTask();
    }
}

const setTaskIntoTimerDisplay = (task = null) => {
    document.querySelector('.header').classList.remove('work');
    document.querySelector('.header').classList.remove('break');
    
    if(task) {
        const curTimerTime = bgPage.getRemainingTime(false);
        const isTimerOn = bgPage.isTimerOn(task.id);
        if(isTimerOn && curTimerTime && curTimerTime > 0) task.time = curTimerTime;
        const minutes = Math.floor(task.time / 60000); 
        const seconds = Math.floor(task.time / 1000) % 60;
        document.querySelector('.header').classList.add(task.type);
        timerDisplay({minutes, seconds});
        document.querySelector('.timer').id = `${task.id}`;
        if(isTimerOn) timerOn = setTimeout(updateTimerDisplay, 800);
    } else {
        timerDisplay();
        document.querySelector('.timer').id = null;
    }    
};

/**
 * @param {{minutes: number, seconds: number}} time 
 */
const timerDisplay = (time = null) => {
    const {minutes, seconds} = time ? time : {minutes: 0, seconds: 0};
    document.querySelector('#minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
    document.querySelector('#seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
};

const mapObject = (object, mapFn = arg => arg) => {
    return Object.keys(object).reduce((acc,cur) => {
        acc[cur] = mapFn(object[cur]);
        return acc;
    }, {});
};

/**
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
const createUniqueID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

init();
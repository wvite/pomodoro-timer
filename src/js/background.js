const curTask = {};
const messageFormat = {
    start_work: {
        type: 'basic',
        iconUrl: '../icons/tomato128.png',
        title: 'Start your work!',
        message: 'We will tell you when worktime is done!'
    },
    start_break: {
        type: 'basic',
        iconUrl: '../icons/tomato128.png',
        title: 'Have a break time!',
        message: 'We will tell you when breaktime is done!'
    },
    done_work: {
        type: 'basic',
        iconUrl: '../icons/tomato128.png',
        title: 'WORKTIME IS DONE',
        message: 'NOW HAVE A BREAK!'
    }, 
    done_break: {
        type: 'basic',
        iconUrl: '../icons/tomato128.png',
        title: 'BREAKTIME IS DONE',
        message: 'NOW GO TO WORK!'
    }
};
/**
 * isTimerOn checks wherther the countdown timer is working for the task whose id is ID
 * @param {string} ID
 */
var isTimerOn = (ID) => {
   return curTask.id === ID && curTask.timer;
}; 

/**
 * getRemainingTime returns the remaining time of the countdown timer.
 * IF format is true, formatted time object {minutes, seconds} is returned, or unformatted time(ms) is returned.
 * @param {boolean} format
 */
var getRemainingTime = (format = true) => {
    if(curTask.remainingTime)
        return format ? { 
            minutes: Math.floor(curTask.remainingTime / 60000),
            seconds: Math.floor(curTask.remainingTime / 1000) % 60
        } : curTask.remainingTime;
    else return undefined;
};

/**
 * startTimer make the countdown timer for task start.
 * @param {{id: string, type: string, name: string, time: number}} task 
 */
var startTimer = (task) => {
    curTask.id = task.id;
    curTask.startedAt = Date.now();
    curTask.duration = task.time;
    curTask.remainingTime = task.time;
    curTask.type = task.type;
    curTask.timer = setTimeout(update, 800);
    notify(`start_${curTask.type}`);
};

/**
 * stopTimer makes the countdown timer stop.
 */
var stopTimer = () => {
    clearTimeout(curTask.timer);
    curTask.timer = null;
};

const update = () => {
    const elapsedTime = Date.now() - curTask.startedAt;
    curTask.remainingTime = curTask.duration - elapsedTime;
    if(curTask.remainingTime > 0){
        curTask.timer = setTimeout(update, 1000);
    } else {
        stopTimer();
        notify(`done_${curTask.type}`);
    }
};

const notify = (type) => {
    chrome.notifications.create(null, messageFormat[type], arg => arg);
};
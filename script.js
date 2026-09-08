/* =========================================
   ELEGANT STOPWATCH
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const display =
    document.getElementById("display");

const centisecondsDisplay =
    document.getElementById("centiseconds");

const statusText =
    document.getElementById("status");

const startBtn =
    document.getElementById("startBtn");

const resetBtn =
    document.getElementById("resetBtn");

const lapBtn =
    document.getElementById("lapBtn");

const lapList =
    document.getElementById("lapList");

const hand =
    document.getElementById("hand");

const ticksGroup =
    document.getElementById("ticks");


/* =========================================
   VARIABLES
========================================= */

let startTime = 0;

let elapsedTime = 0;

let timerInterval = null;

let running = false;

let laps = [];

let lastLapTime = 0;


/* =========================================
   CREATE CLOCK TICKS
========================================= */

function createTicks() {

    const center = 200;

    const outerRadius = 178;

    const normalRadius = 169;

    const majorRadius = 160;


    for (let i = 0; i < 60; i++) {

        const angle =
            (i * 6 - 90) *
            Math.PI / 180;


        const isMajor =
            i % 5 === 0;


        const innerRadius =
            isMajor
                ? majorRadius
                : normalRadius;


        const x1 =
            center +
            Math.cos(angle) *
            innerRadius;


        const y1 =
            center +
            Math.sin(angle) *
            innerRadius;


        const x2 =
            center +
            Math.cos(angle) *
            outerRadius;


        const y2 =
            center +
            Math.sin(angle) *
            outerRadius;


        const tick =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        tick.setAttribute(
            "x1",
            x1
        );

        tick.setAttribute(
            "y1",
            y1
        );

        tick.setAttribute(
            "x2",
            x2
        );

        tick.setAttribute(
            "y2",
            y2
        );


        tick.classList.add("tick");


        if (isMajor) {

            tick.classList.add("major");
        }


        ticksGroup.appendChild(tick);
    }
}


/* =========================================
   FORMAT MAIN TIME
========================================= */

function formatTime(time) {

    const minutes =
        Math.floor(
            time / 60000
        );


    const seconds =
        Math.floor(
            (time % 60000) / 1000
        );


    const centiseconds =
        Math.floor(
            (time % 1000) / 10
        );


    return {

        minutes:
            String(minutes)
                .padStart(2, "0"),

        seconds:
            String(seconds)
                .padStart(2, "0"),

        centiseconds:
            String(centiseconds)
                .padStart(2, "0")
    };
}


/* =========================================
   UPDATE DISPLAY
========================================= */

function updateDisplay() {

    const currentTime =
        running
            ? Date.now() - startTime
            : elapsedTime;


    const time =
        formatTime(currentTime);


    display.textContent =
        `${time.minutes}:${time.seconds}`;


    centisecondsDisplay.textContent =
        `.${time.centiseconds}`;


    updateHand(currentTime);
}


/* =========================================
   UPDATE STOPWATCH HAND
========================================= */

function updateHand(time) {

    const seconds =
        (time / 1000) % 60;


    const angle =
        seconds * 6;


    hand.style.transform =
        `rotate(${angle}deg)`;
}


/* =========================================
   START / PAUSE
========================================= */

function startStopwatch() {

    if (running) {

        /* PAUSE */

        elapsedTime =
            Date.now() - startTime;


        clearInterval(
            timerInterval
        );


        timerInterval = null;

        running = false;


        startBtn.textContent =
            "START";


        statusText.textContent =
            "PAUSED";


        lapBtn.disabled = true;


        updateDisplay();

        return;
    }


    /* START */

    startTime =
        Date.now() - elapsedTime;


    running = true;


    statusText.textContent =
        "RUNNING";


    startBtn.textContent =
        "PAUSE";


    lapBtn.disabled = false;


    timerInterval =
        setInterval(
            updateDisplay,
            10
        );


    updateDisplay();
}


/* =========================================
   RESET
========================================= */

function resetStopwatch() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;

    running = false;

    startTime = 0;

    elapsedTime = 0;

    lastLapTime = 0;

    laps = [];


    startBtn.textContent =
        "START";


    statusText.textContent =
        "READY";


    lapBtn.disabled = true;


    display.textContent =
        "00:00";


    centisecondsDisplay.textContent =
        ".00";


    hand.style.transform =
        "rotate(0deg)";


    lapList.innerHTML = `
        <div class="empty-laps">
            Recorded laps will appear here
        </div>
    `;
}


/* =========================================
   RECORD LAP
========================================= */

function recordLap() {

    if (!running) {

        return;
    }


    const currentTime =
        Date.now() - startTime;


    const splitTime =
        currentTime - lastLapTime;


    lastLapTime =
        currentTime;


    laps.push({

        number:
            laps.length + 1,

        split:
            splitTime,

        total:
            currentTime
    });


    renderLaps();
}


/* =========================================
   FORMAT LAP TIME
========================================= */

function formatLapTime(time) {

    const minutes =
        Math.floor(
            time / 60000
        );


    const seconds =
        Math.floor(
            (time % 60000) / 1000
        );


    const centiseconds =
        Math.floor(
            (time % 1000) / 10
        );


    return (
        String(minutes).padStart(2, "0")
        + ":"
        + String(seconds).padStart(2, "0")
        + "."
        + String(centiseconds).padStart(2, "0")
    );
}


/* =========================================
   DISPLAY LAPS
========================================= */

function renderLaps() {

    lapList.innerHTML = "";


    let fastestIndex = -1;


    /* Find fastest lap */

    if (laps.length > 1) {

        let fastest =
            Infinity;


        laps.forEach(
            (lap, index) => {

                if (
                    lap.split < fastest
                ) {

                    fastest =
                        lap.split;

                    fastestIndex =
                        index;
                }
            }
        );
    }


    /* Newest lap first */

    [...laps]
        .reverse()
        .forEach(
            lap => {

                const index =
                    laps.indexOf(lap);


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "lap-item";


                if (
                    index === fastestIndex
                ) {

                    item.classList.add(
                        "fastest"
                    );
                }


                item.innerHTML = `

                    <span class="lap-num">
                        Lap ${lap.number}
                    </span>

                    <span class="lap-delta">
                        ${formatLapTime(lap.split)}
                    </span>

                    <span class="lap-time">
                        ${formatLapTime(lap.total)}
                    </span>

                `;


                lapList.appendChild(
                    item
                );
            }
        );
}


/* =========================================
   BUTTON EVENTS
========================================= */

startBtn.addEventListener(
    "click",
    startStopwatch
);


resetBtn.addEventListener(
    "click",
    resetStopwatch
);


lapBtn.addEventListener(
    "click",
    recordLap
);


/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        /* Ignore keyboard shortcuts
           when typing */

        const activeElement =
            document.activeElement;

        const isTyping =
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT"
            );


        if (isTyping) {

            return;
        }


        /* SPACE = START / PAUSE */

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            startStopwatch();

            return;
        }


        /* L = LAP */

        if (
            event.key.toLowerCase() === "l"
        ) {

            recordLap();

            return;
        }


        /* R = RESET */

        if (
            event.key.toLowerCase() === "r"
        ) {

            resetStopwatch();

            return;
        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

createTicks();

updateDisplay();
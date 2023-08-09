const timer = document.querySelector('.timer');
const title = document.querySelector('.title');
const startBtn = document.querySelector('.startBtn');
const pauseBtn = document.querySelector('.pauseBtn');
const resumeBtn = document.querySelector('.resumeBtn');
const resetBtn = document.querySelector('.resetBtn');
const pomoCountDisplay = document.querySelector('.pomoCountDisplay');

const WORK_TIME = 25*60;
const BREAK_TIME = 5*60;
let timerID=null;
let oneRoundCompleted=false; // one round = work time + break time
let totalCount=0;
let paused=false;
// function to update title
const updateTitle = (msg) => {
    title.textContent = msg; 
}
// function to save pomodoro counts to local storage
const saveLocalCounts = () => {
    let counts = JSON.parse(localStorage.getItem("pomoCounts")); 
    counts !== null ? counts++ : counts=1;
    localStorage.setItem("pomoCounts", JSON.stringify(counts));
}
// function to countdown
const countDown = (time) => {
     return () => {
        // get time in minutes
        const mins = Math.floor(time/60).toString().padStart(2, '0');  
        const secs = Math.floor(time%60).toString().padStart(2, '0');
        timer.textContent=`${mins}:${secs}`;
        time--;
        if(time<0){
          stopTimer();
          if(oneRoundCompleted===false){
             timerID = startTimer(BREAK_TIME);
             oneRoundCompleted=true;
             updateTitle("It's Break Time!");
          }
          else{
            updateTitle("Completed 1 Round of Pomodoro Technique!");
            setTimeout(()=>updateTitle("Start Timer Again!"), 2000);
            totalCount++;
            saveLocalCounts();
            showPomoCounts();
          }
        }
     }
}
// function to start timer
const startTimer = (startTime) => {
   if(timer !== null){
     stopTimer();
   }
   return setInterval(countDown(startTime), 1000);
}
// function to stop timer
const stopTimer = () => {
    clearInterval(timerID);
    timerID=null;
}
// function to get time in  seconds
const getTimeInSeconds = (timeString) => {
   const[minutes, seconds] = timeString.split(":");
   return parseInt(minutes * 60) + parseInt(seconds);
}
// adding event listener to start button
startBtn.addEventListener('click', ()=>{
     timerID=startTimer(WORK_TIME);
     updateTitle("It's Work Time!");
})
// adding event listener to reset button
resetBtn.addEventListener('click', ()=>{
   stopTimer();
   timer.textContent="25:00";
   updateTitle("Click start to start timer");
})
// adding event listener to pause button
pauseBtn.addEventListener('click', ()=>{
     stopTimer();
     paused=true;
     updateTitle("Timer Paused");
})
resumeBtn.addEventListener('click', ()=>{
     if(paused){
          const currentTime = getTimeInSeconds(timer.textContent);
          timerID = startTimer(currentTime);
          paused=false;
          (!oneRoundCompleted) ? updateTitle("It's Work Time") : updateTitle("It's Break Time");
     }
})
// function to show completed pomodoros to screen from local storage
const showPomoCounts = () => {
     const counts = JSON.parse(localStorage.getItem("pomoCounts"));
     if(counts > 0){
       pomoCountDisplay.style.display="flex";
     }
     pomoCountDisplay.firstElementChild.textContent=counts;
}
showPomoCounts();
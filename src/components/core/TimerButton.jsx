import React, { useState, useEffect } from 'react';
import cc from 'classcat';

import './timerButton.css';

const TimerButton = ({ time, unit, text }) => {
  const [timerText, setTimerText] = useState(text);
  const [timerTime, setTimerTime] = useState(0);
  const [timerDone, setTimerDone] = useState(false);

  const parseTime = (dateTime) => {
    let timeText = '';
    const hours = dateTime.getHours();
    if (hours) {
      if (hours < 10) {
        timeText += 0;
      }
      timeText += `${hours}:`;
    }
    const minutes = dateTime.getMinutes();
    if (minutes < 10) {
      timeText += 0;
    }
    timeText += `${minutes}:`;
    const seconds = dateTime.getSeconds();
    if (seconds < 10) {
      timeText += 0;
    }
    timeText += seconds;
    setTimerText(timeText);
  }

  const timeToDateType = () => {
    let milliseconds;
    switch(unit) {
      case 'second':
        milliseconds = time * 1000;
        break;
      case 'minute':
        milliseconds = time * 1000 * 60;
        break;
      case 'hour': 
        milliseconds = time * 1000 * 60 * 60;
        break;
      case 'day':
        milliseconds = time * 1000 * 60 * 60 * 24;
        break;
    }
    setTimerTime(milliseconds);
    
    const timeDate = new Date(milliseconds);
    var userTimezoneOffset = timeDate.getTimezoneOffset() * 60000;
    const date = new Date(timeDate.getTime() + userTimezoneOffset);
    parseTime(date);
  }

  const updateTimerText = newTimeLeft => {
    const timeDate = new Date(newTimeLeft);
    var userTimezoneOffset = timeDate.getTimezoneOffset() * 60000;
    const date = new Date(timeDate.getTime() + userTimezoneOffset);
    parseTime(date);
  }

  useEffect(() => {
    timeToDateType();
  }, []);

  const startTimer = () => {
    let timeLeft = timerTime;
    /* TODO
      Make timer go negative, so you might see how much time has passed since timer is done
    */
    timeLeft -= 1000;
    updateTimerText(timeLeft);
    if (timeLeft <= 0) {

    } else { 
      const activeTimer = setInterval(() => {
        timeLeft -= 1000;
        updateTimerText(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(activeTimer);
          setTimerDone(true);
        }
      }, 1000);
    }
  }

  return (
    <button 
      onClick={startTimer}
      className={cc(['timerButton', {
        'timerButton--done': timerDone
      }])}
    >
      {timerText}
    </button>
  )
}

export default TimerButton;

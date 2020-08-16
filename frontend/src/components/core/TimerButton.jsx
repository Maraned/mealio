import React, { useState, useEffect } from 'react';
import cc from 'classcat';

import { FaPause, FaClock } from 'react-icons/fa';

import './timerButton.css';

const TimerButton = ({ time, unit, text }) => {
  const [timerText, setTimerText] = useState(text);
  const [timerTime, setTimerTime] = useState(0);
  const [timerDone, setTimerDone] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

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
      default:
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateTimerText(timerTime);
    // eslint-disable-next-line
  }, [timerTime])

  const updateTimeLeft = () => {
    if (!timerDone && timerStarted) {
      setTimeout(() => {
        if (timerPaused) {
          return
        } else if (timerTime > 0) {
          setTimerTime(timerTime - 1000);
        } else if (timerTime <= 0) {
          setTimerDone(true);
          setTimerTime(0);
        }
      }, 1000);
    }
  }

  const startTimer = () => {
    if (!timerStarted) {
      setTimerStarted(true);
    } else {
      setTimerPaused(!timerPaused);
    }
  }

  useEffect(() => {
    updateTimeLeft();
    // eslint-disable-next-line 
  }, [timerTime, timerStarted, timerPaused]);

  return (
    <button 
      onClick={startTimer}
      className={cc(['timerButton', {
        'timerButton--active': timerStarted,
        'timerButton--done': timerDone
      }])}
    >
      <FaClock className="timerButton__clockIcon" />
      {timerText}
      {timerPaused && (
        <div className="timerButton--paused">
          <FaPause />
        </div>
      )}
    </button>
  )
}

export default TimerButton;

// frontend/src/pages/Pomodoro.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [completedSessions, setCompletedSessions] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      if (mode === 'work') {
        alert('Work session complete! Take a break.');
        setCompletedSessions(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        alert('Break over! Back to work.');
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsActive(false);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const changeMode = (newMode) => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Pomodoro Timer</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <h2 className={`display-1 mb-4 ${mode === 'work' ? 'text-primary' : 'text-success'}`}>
                {formatTime(timeLeft)}
              </h2>
              
              <div className="mb-4">
                <span className={`badge ${mode === 'work' ? 'bg-primary' : 'bg-success'} fs-5`}>
                  {mode === 'work' ? '⏰ Focus Time' : '☕ Break Time'}
                </span>
              </div>

              <div className="d-flex justify-content-center gap-3 mb-4">
                <button
                  className={`btn btn-lg ${isActive ? 'btn-warning' : 'btn-success'}`}
                  onClick={toggleTimer}
                >
                  {isActive ? <><FaPause /> Pause</> : <><FaPlay /> Start</>}
                </button>
                
                <button
                  className="btn btn-lg btn-secondary"
                  onClick={resetTimer}
                >
                  <FaRedo /> Reset
                </button>
              </div>

              <div className="d-flex justify-content-center gap-2 mb-4">
                <button
                  className={`btn ${mode === 'work' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => changeMode('work')}
                >
                  Work (25:00)
                </button>
                <button
                  className={`btn ${mode === 'break' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => changeMode('break')}
                >
                  Break (5:00)
                </button>
              </div>

              <div className="card mt-4">
                <div className="card-body">
                  <h5>Statistics</h5>
                  <p>Completed Sessions: {completedSessions}</p>
                  <p>Current Mode: {mode === 'work' ? 'Focus' : 'Break'}</p>
                  <p>Next Long Break in: {4 - (completedSessions % 4)} sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>What is Pomodoro?</h5>
              <p>Work for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer break.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Tips</h5>
              <ul>
                <li>Eliminate distractions</li>
                <li>Focus on one task</li>
                <li>Stand up during breaks</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5>Benefits</h5>
              <ul>
                <li>Increased focus</li>
                <li>Reduced burnout</li>
                <li>Better time management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
// frontend/src/pages/Pomodoro.jsx
import React, { useState, useEffect, useRef } from "react";
import { 
  FaPlay, FaPause, FaRedo, FaCoffee, FaBrain, 
  FaCog, FaChevronUp, FaChevronDown, FaCheck,
  FaFire, FaHistory, FaBell, FaVolumeUp, FaTimes
} from "react-icons/fa";
import api from '../utils/axiosConfig';
// And verify you use 'api.get', 'api.post' instead of 'axios.get'
const Pomodoro = () => {
  // State for times (in minutes for display, seconds for timer)
  const [workTime, setWorkTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [longBreakTime, setLongBreakTime] = useState(15); // minutes
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'break', 'longBreak'
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Settings state
  const [tempSettings, setTempSettings] = useState({
    work: 25,
    break: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4
  });

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Update temp settings when main settings change
  useEffect(() => {
    setTempSettings({
      work: workTime,
      break: breakTime,
      longBreak: longBreakTime,
      sessionsBeforeLongBreak: sessionsBeforeLongBreak
    });
  }, [workTime, breakTime, longBreakTime, sessionsBeforeLongBreak]);

  const handleTimerComplete = () => {
    // Play sound
    if (soundEnabled) {
      playCompletionSound();
    }

    // Show notification
    if (notificationsEnabled && document.hidden) {
      showNotification();
    }

    if (mode === 'work') {
      const newSessions = completedSessions + 1;
      setCompletedSessions(newSessions);
      
      // Check if it's time for a long break
      if (newSessions % sessionsBeforeLongBreak === 0) {
        setMode('longBreak');
        setTimeLeft(longBreakTime * 60); // Convert to seconds
      } else {
        setMode('break');
        setTimeLeft(breakTime * 60); // Convert to seconds
      }
    } else {
      setMode('work');
      setTimeLeft(workTime * 60); // Convert to seconds
    }
    
    setIsActive(false);
  };

  const playCompletionSound = () => {
    const audio = mode === 'work' 
      ? 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
      : 'https://actions.google.com/sounds/v1/cartoon/clank_car_crash.ogg';
    
    const sound = new Audio(audio);
    sound.volume = 0.5;
    sound.play().catch(e => console.log("Audio play failed", e));
  };

  const showNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const title = mode === 'work' ? 'Focus Complete!' : 'Break Time!';
      const body = mode === 'work' 
        ? 'Great job! Take a well-deserved break.'
        : 'Break is over! Time to focus again.';
      
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getCurrentModeTime());
  };

  const getCurrentModeTime = () => {
    switch(mode) {
      case 'work': return workTime * 60;
      case 'break': return breakTime * 60;
      case 'longBreak': return longBreakTime * 60;
      default: return workTime * 60;
    }
  };

  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    switch(newMode) {
      case 'work': setTimeLeft(workTime * 60); break;
      case 'break': setTimeLeft(breakTime * 60); break;
      case 'longBreak': setTimeLeft(longBreakTime * 60); break;
    }
  };

  const handleSettingChange = (setting, value) => {
    const numValue = Math.max(1, Math.min(60, parseInt(value) || 1));
    setTempSettings(prev => ({
      ...prev,
      [setting]: numValue
    }));
  };

  const saveSettings = () => {
    // Update the actual timer settings
    setWorkTime(tempSettings.work);
    setBreakTime(tempSettings.break);
    setLongBreakTime(tempSettings.longBreak);
    setSessionsBeforeLongBreak(tempSettings.sessionsBeforeLongBreak);
    
    // Reset timer with new times
    if (mode === 'work') {
      setTimeLeft(tempSettings.work * 60);
    } else if (mode === 'break') {
      setTimeLeft(tempSettings.break * 60);
    } else if (mode === 'longBreak') {
      setTimeLeft(tempSettings.longBreak * 60);
    }
    
    setIsActive(false);
    setShowSettings(false);
  };

  const cancelSettings = () => {
    // Reset temp settings to current values
    setTempSettings({
      work: workTime,
      break: breakTime,
      longBreak: longBreakTime,
      sessionsBeforeLongBreak: sessionsBeforeLongBreak
    });
    setShowSettings(false);
  };

  // Quick presets
  const applyPreset = (preset) => {
    const presets = {
      standard: { work: 25, break: 5, longBreak: 15, sessions: 4 },
      short: { work: 15, break: 3, longBreak: 10, sessions: 4 },
      long: { work: 45, break: 10, longBreak: 20, sessions: 4 },
      custom: { work: 50, break: 10, longBreak: 25, sessions: 2 }
    };
    
    const selected = presets[preset];
    setWorkTime(selected.work);
    setBreakTime(selected.break);
    setLongBreakTime(selected.longBreak);
    setSessionsBeforeLongBreak(selected.sessions);
    
    // Update timer if in corresponding mode
    if (mode === 'work') {
      setTimeLeft(selected.work * 60);
    } else if (mode === 'break') {
      setTimeLeft(selected.break * 60);
    } else if (mode === 'longBreak') {
      setTimeLeft(selected.longBreak * 60);
    }
    
    setIsActive(false);
  };

  // Calculate progress for circle
  const totalTime = getCurrentModeTime();
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  // Get mode-specific colors
  const getModeColor = () => {
    switch(mode) {
      case 'work': return '#4f46e5';
      case 'break': return '#10b981';
      case 'longBreak': return '#8b5cf6';
      default: return '#4f46e5';
    }
  };

  const getModeTitle = () => {
    switch(mode) {
      case 'work': return 'Focus Time';
      case 'break': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  const getModeIcon = () => {
    switch(mode) {
      case 'work': return <FaBrain size={28} />;
      case 'break': return <FaCoffee size={28} />;
      case 'longBreak': return <FaCoffee size={28} />;
      default: return <FaBrain size={28} />;
    }
  };

  const sessionsUntilLongBreak = sessionsBeforeLongBreak - (completedSessions % sessionsBeforeLongBreak);

  return (
    <div className="pomodoro-wrapper px-3">
      <div className="glass-container pomodoro-enhanced">
        
        {/* Header with Stats */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '2.5rem' }}>
              Pomodoro Timer
            </h1>
            <p className="mb-0" style={{ color: 'var(--text-muted)' }}>
              Boost your productivity with focused intervals
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '50px', height: '50px' }}
            title="Settings"
          >
            <FaCog size={20} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="pomodoro-presets mb-4">
          <button className="preset-btn" onClick={() => applyPreset('standard')}>Standard (25/5)</button>
          <button className="preset-btn" onClick={() => applyPreset('short')}>Short (15/3)</button>
          <button className="preset-btn" onClick={() => applyPreset('long')}>Long (45/10)</button>
          <button className="preset-btn" onClick={() => applyPreset('custom')}>Custom (50/10)</button>
        </div>

        {/* Mode Selector */}
        <div className="mode-selector mb-5">
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => changeMode('work')}
              className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
              style={{ 
                background: mode === 'work' ? 'var(--brand-primary)' : 'transparent',
                color: mode === 'work' ? 'white' : 'var(--text-body)',
                border: `2px solid ${mode === 'work' ? 'var(--brand-primary)' : 'var(--card-border)'}`
              }}
            >
              <FaBrain /> Focus ({workTime} min)
            </button>
            <button
              onClick={() => changeMode('break')}
              className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
              style={{ 
                background: mode === 'break' ? '#10b981' : 'transparent',
                color: mode === 'break' ? 'white' : 'var(--text-body)',
                border: `2px solid ${mode === 'break' ? '#10b981' : 'var(--card-border)'}`
              }}
            >
              <FaCoffee /> Break ({breakTime} min)
            </button>
            <button
              onClick={() => changeMode('longBreak')}
              className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
              style={{ 
                background: mode === 'longBreak' ? '#8b5cf6' : 'transparent',
                color: mode === 'longBreak' ? 'white' : 'var(--text-body)',
                border: `2px solid ${mode === 'longBreak' ? '#8b5cf6' : 'var(--card-border)'}`
              }}
            >
              <FaCoffee /> Long Break ({longBreakTime} min)
            </button>
          </div>
        </div>

        {/* Timer Circle - Enhanced */}
        <div className="timer-circle-container-enhanced">
          <div className="timer-circle-wrapper">
            <svg className="timer-svg-enhanced" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="circle-bg-enhanced" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="circle-progress-enhanced"
                style={{ 
                  strokeDasharray: 283, 
                  strokeDashoffset,
                  stroke: getModeColor(),
                  filter: `drop-shadow(0 0 8px ${getModeColor()}40)`
                }}
              />
            </svg>
            
            <div className="timer-display">
              <div className="timer-text-enhanced">
                <h2>{formatTime(timeLeft)}</h2>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  {getModeIcon()}
                  <p className="mb-0">{getModeTitle()}</p>
                </div>
                <p className="timer-status">{isActive ? '⏳ Running' : '⏸️ Paused'}</p>
                <div className="current-time-settings">
                  <small style={{ color: 'var(--text-muted)' }}>
                    {mode === 'work' ? `${workTime} min focus` : 
                     mode === 'break' ? `${breakTime} min break` : 
                     `${longBreakTime} min long break`}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-enhanced mb-5">
          <div className="d-flex justify-content-center gap-4 align-items-center">
            <button 
              className="btn-control btn-control-main"
              onClick={toggleTimer}
              style={{ 
                background: getModeColor(),
                boxShadow: `0 8px 24px ${getModeColor()}40`
              }}
            >
              {isActive ? <FaPause size={24} /> : <FaPlay size={24} style={{ marginLeft: '4px' }} />}
            </button>
            
            <button 
              className="btn-control btn-control-secondary"
              onClick={resetTimer}
            >
              <FaRedo size={18} />
            </button>
            
            <button 
              className={`btn-control btn-control-toggle ${notificationsEnabled ? 'active' : ''}`}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              title={notificationsEnabled ? "Notifications On" : "Notifications Off"}
            >
              <FaBell size={18} />
            </button>
            
            <button 
              className={`btn-control btn-control-toggle ${soundEnabled ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Sound On" : "Sound Off"}
            >
              <FaVolumeUp size={18} />
            </button>
          </div>
        </div>

        {/* Session Indicator */}
        <div className="session-indicator mb-4">
          {Array.from({ length: sessionsBeforeLongBreak }, (_, i) => (
            <div 
              key={i}
              className={`session-dot ${i < completedSessions % sessionsBeforeLongBreak ? 'completed' : ''} ${i === completedSessions % sessionsBeforeLongBreak ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="row g-4">
            <div className="col-4">
              <div className="stat-box">
                <div className="stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                  <FaFire style={{ color: '#4f46e5' }} />
                </div>
                <div className="stat-content">
                  <h3>{completedSessions}</h3>
                  <p>Sessions</p>
                </div>
              </div>
            </div>
            
            <div className="col-4">
              <div className="stat-box">
                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <FaHistory style={{ color: '#8b5cf6' }} />
                </div>
                <div className="stat-content">
                  <h3>{sessionsUntilLongBreak}</h3>
                  <p>Until Long Break</p>
                </div>
              </div>
            </div>
            
            <div className="col-4">
              <div className="stat-box">
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <FaBrain style={{ color: '#10b981' }} />
                </div>
                <div className="stat-content">
                  <h3>{workTime}:{breakTime}</h3>
                  <p>Work:Break</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h4>Customize Timer</h4>
              <button 
                className="btn-close-settings"
                onClick={cancelSettings}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="settings-content">
              <div className="setting-item">
                <label>Focus Time (minutes)</label>
                <div className="setting-control">
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('work', tempSettings.work - 1)}
                    disabled={tempSettings.work <= 1}
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    value={tempSettings.work}
                    onChange={(e) => handleSettingChange('work', e.target.value)}
                    min="1"
                    max="60"
                    className="setting-input"
                  />
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('work', tempSettings.work + 1)}
                    disabled={tempSettings.work >= 60}
                  >
                    <FaChevronUp />
                  </button>
                </div>
                <small className="text-muted">Current: {workTime} minutes</small>
              </div>
              
              <div className="setting-item">
                <label>Short Break (minutes)</label>
                <div className="setting-control">
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('break', tempSettings.break - 1)}
                    disabled={tempSettings.break <= 1}
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    value={tempSettings.break}
                    onChange={(e) => handleSettingChange('break', e.target.value)}
                    min="1"
                    max="60"
                    className="setting-input"
                  />
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('break', tempSettings.break + 1)}
                    disabled={tempSettings.break >= 60}
                  >
                    <FaChevronUp />
                  </button>
                </div>
                <small className="text-muted">Current: {breakTime} minutes</small>
              </div>
              
              <div className="setting-item">
                <label>Long Break (minutes)</label>
                <div className="setting-control">
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('longBreak', tempSettings.longBreak - 1)}
                    disabled={tempSettings.longBreak <= 1}
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    value={tempSettings.longBreak}
                    onChange={(e) => handleSettingChange('longBreak', e.target.value)}
                    min="1"
                    max="60"
                    className="setting-input"
                  />
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('longBreak', tempSettings.longBreak + 1)}
                    disabled={tempSettings.longBreak >= 60}
                  >
                    <FaChevronUp />
                  </button>
                </div>
                <small className="text-muted">Current: {longBreakTime} minutes</small>
              </div>
              
              <div className="setting-item">
                <label>Sessions before Long Break</label>
                <div className="setting-control">
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('sessionsBeforeLongBreak', tempSettings.sessionsBeforeLongBreak - 1)}
                    disabled={tempSettings.sessionsBeforeLongBreak <= 1}
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    value={tempSettings.sessionsBeforeLongBreak}
                    onChange={(e) => handleSettingChange('sessionsBeforeLongBreak', e.target.value)}
                    min="1"
                    max="10"
                    className="setting-input"
                  />
                  <button 
                    className="btn-setting-adjust"
                    onClick={() => handleSettingChange('sessionsBeforeLongBreak', tempSettings.sessionsBeforeLongBreak + 1)}
                    disabled={tempSettings.sessionsBeforeLongBreak >= 10}
                  >
                    <FaChevronUp />
                  </button>
                </div>
                <small className="text-muted">Current: {sessionsBeforeLongBreak} sessions</small>
              </div>
              
              <div className="settings-actions d-flex gap-2">
                <button 
                  className="btn-save-settings"
                  onClick={saveSettings}
                >
                  <FaCheck /> Apply Settings
                </button>
                <button 
                  className="btn-cancel-settings"
                  onClick={cancelSettings}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="tips-section mt-4">
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            💡 Tip: {mode === 'work' 
              ? 'Focus on one task at a time until the timer ends.' 
              : 'Stand up, stretch, and look away from your screen.'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Pomodoro;
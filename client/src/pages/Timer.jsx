
import { useEffect, useState, useRef } from "react";
import API from "../Services/api";


// Move constants outside the component for stable references
const FOCUS_TIME = 25*60; // 15 seconds for testing; change to 25*60 for real use
const BREAK_TIME =5*60; // 5 seconds for testing; change to 5*60 for real use

function Timer() {
  // State
  const savedState = JSON.parse(localStorage.getItem("timerState"));

const [seconds, setSeconds] = useState(
  savedState?.seconds ?? FOCUS_TIME
);

const [isRunning, setIsRunning] = useState(
  savedState?.isRunning ?? false
);

const [isBreak, setIsBreak] = useState(
  savedState?.isBreak ?? false
);

  // Refs
  const intervalRef = useRef(null);
  const hasSavedRef = useRef(false);
  const secondsRef = useRef(seconds);
  const isBreakRef = useRef(isBreak);

  // Keep refs updated with latest state
  useEffect(() => { secondsRef.current = seconds }, [seconds]);
  useEffect(() => { isBreakRef.current = isBreak }, [isBreak]);

  // Restore timer state from localStorage
  // useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem("timerState"));
  //   if (saved) {
  //     setSeconds(saved.seconds);
  //     setIsBreak(saved.isBreak);
  //     setIsRunning(saved.isRunning);
  //   } else {
  //     setSeconds(FOCUS_TIME);
  //     setIsBreak(false);
  //     setIsRunning(false);
  //   }
  // }, []);

  // Persist timer state continuously
  useEffect(() => {
    localStorage.setItem(
      "timerState",
      JSON.stringify({ seconds, isBreak, isRunning })
    );
  }, [seconds, isBreak, isRunning]);

  // Timer interval
  useEffect(() => {
  if (!isRunning) return;

  intervalRef.current = setInterval(() => {
    setSeconds(prev => {
      if (prev === 0) {

        // Save session at end of focus
        if (!isBreakRef.current && !hasSavedRef.current) {
          hasSavedRef.current = true;
          API.post("/sessions", { duration: FOCUS_TIME / 60 })
             .then(res => console.log("Session saved:", res.data))
             .catch(err => console.error("API error:", err.response || err));
        }

        const nextIsBreak = !isBreakRef.current;
        setIsBreak(nextIsBreak);

        // Reset hasSavedRef when new focus session starts
        if (!nextIsBreak) hasSavedRef.current = false;

        return nextIsBreak ? BREAK_TIME : FOCUS_TIME;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(intervalRef.current);
}, [isRunning]);
 

  // Format time for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset timer
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(FOCUS_TIME);
    hasSavedRef.current = false;
    localStorage.removeItem("timerState");
  };

return (
  <div style={{ textAlign: "center", marginTop: "40px" }}>
    
    <h2>{isBreak ? "Break Time" : "Focus Time"}</h2>

    <h1 style={{ fontSize: "60px" }}>
      {formatTime(seconds)}
    </h1>

    <div style={{ marginTop: "20px" }}>
      <button onClick={() => setIsRunning(true)} disabled={isRunning}>
  Start
</button>
      <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
  Pause
</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  </div>
  
);
}
export default Timer;
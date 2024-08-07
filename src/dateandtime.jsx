import React, { useState, useEffect } from 'react';

function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const options = { timeZone: 'Asia/Manila', hour12: true };
  const time = currentTime.toLocaleTimeString('en-US', options);
  const day = currentTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Manila' });
  const date = currentTime.toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="clock">
      <p className="time">{time}</p>
      <p className="day-date">{`${day} | ${date}`}</p>
    </div>
  );
}

export default RealTimeClock;

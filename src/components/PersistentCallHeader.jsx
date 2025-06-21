import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  PhoneOff, 
  Maximize2,
  Phone
} from 'lucide-react';

// Persistent Call Header Component
const PersistentCallHeader = ({ isCallActive, onReturnToCall, onEndCall }) => {
  const [callData, setCallData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  // Generate random call data
  useEffect(() => {
    if (isCallActive && !callData) {
      const areaCodes = ['469', '214', '972', '817', '903', '940', '430', '945'];
      const randomAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
      const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
      const randomMinutes = Math.floor(Math.random() * 15);
      const randomSeconds = Math.floor(Math.random() * 60);
      
      setCallData({
        phoneNumber: `(${randomAreaCode}) ${randomNumber.toString().slice(0,3)}-${randomNumber.toString().slice(3)}`,
        startTime: Date.now() - (randomMinutes * 60000) - (randomSeconds * 1000),
        customerName: generateRandomName()
      });
    }
  }, [isCallActive, callData]);

  // Generate random customer name
  const generateRandomName = () => {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Ashley'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  // Calculate call duration
  const [callDuration, setCallDuration] = useState('00:00:00');

  useEffect(() => {
    if (!isCallActive || !callData) return;

    const updateTimer = () => {
      const elapsed = Date.now() - callData.startTime;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      setCallDuration(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCallActive, callData]);

  if (!isCallActive || !callData) return null;

  return (
    <div className="persistent-call-header">
      <div className="call-info">
        <div className="call-timer">{callDuration}</div>
        <div className="call-details">
          <div className="caller-number">{callData.phoneNumber}</div>
          <div className="caller-name">{callData.customerName}</div>
        </div>
      </div>

      <div className="call-controls">
        <button 
          className={`call-control-btn ${isMuted ? 'active' : ''}`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isMuted ? 'Muted' : 'Mute'}</span>
        </button>

        <button 
          className={`call-control-btn ${isOnHold ? 'active' : ''}`}
          onClick={() => setIsOnHold(!isOnHold)}
          title={isOnHold ? 'Resume' : 'Hold'}
        >
          {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          <span>{isOnHold ? 'Resume' : 'Hold'}</span>
        </button>

        <button 
          className="call-control-btn end-call"
          onClick={onEndCall}
          title="End Call"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End</span>
        </button>

        <button 
          className="call-control-btn expand"
          onClick={onReturnToCall}
          title="Return to Call Interface"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PersistentCallHeader;


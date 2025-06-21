import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff,
  Keyboard,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Settings,
  Zap,
  Globe,
  ChevronDown,
  X
} from 'lucide-react';

const CompactCallControls = ({ onSendMessage, onToggleKeyboard, onToggleRecord, isRecording = false }) => {
  const [message, setMessage] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [showTranslationOptions, setShowTranslationOptions] = useState(false);
  const textareaRef = useRef(null);

  const quickResponses = [
    "Thank you for contacting us. How can I help you today?",
    "I understand your concern. Let me look into this for you.",
    "Could you please provide more details about the issue?",
    "I'll escalate this to our technical team right away.",
    "Your issue has been resolved. Is there anything else I can help with?",
    "Thank you for your patience. We appreciate your business."
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
  ];

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const toggleKeyboard = () => {
    setIsKeyboardOpen(!isKeyboardOpen);
    onToggleKeyboard && onToggleKeyboard(!isKeyboardOpen);
  };

  const toggleRecord = () => {
    onToggleRecord && onToggleRecord(!isRecording);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const insertQuickResponse = (response) => {
    setMessage(response);
    setShowQuickResponses(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="compact-call-controls">
      {/* Quick Responses Dropdown */}
      {showQuickResponses && (
        <div className="quick-responses-dropdown">
          <div className="dropdown-header">
            <span className="font-medium">Quick Responses</span>
            <button 
              onClick={() => setShowQuickResponses(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="responses-list">
            {quickResponses.map((response, index) => (
              <button
                key={index}
                onClick={() => insertQuickResponse(response)}
                className="response-item"
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Options */}
      {showTranslationOptions && (
        <div className="translation-dropdown">
          <div className="dropdown-header">
            <span className="font-medium">Translation Settings</span>
            <button 
              onClick={() => setShowTranslationOptions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="translation-options">
            <div className="option-group">
              <label className="option-label">Translate to:</label>
              <div className="language-grid">
                {languages.map((lang) => (
                  <button key={lang.code} className="language-option">
                    <span className="flag">{lang.flag}</span>
                    <span className="name">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="option-group">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox" defaultChecked />
                <span>Auto-translate incoming messages</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="checkbox" defaultChecked />
                <span>Auto-translate outgoing messages</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="input-container">
        {/* Top Controls Row */}
        <div className="controls-row">
          <div className="left-controls">
            <button 
              onClick={() => setShowQuickResponses(!showQuickResponses)}
              className={`control-btn ${showQuickResponses ? 'active' : ''}`}
              title="Quick Responses"
            >
              <Zap className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setShowTranslationOptions(!showTranslationOptions)}
              className={`control-btn ${showTranslationOptions ? 'active' : ''}`}
              title="Translation Options"
            >
              <Globe className="w-4 h-4" />
            </button>
            
            <button 
              onClick={toggleKeyboard}
              className={`control-btn ${isKeyboardOpen ? 'active' : ''}`}
              title="Virtual Keyboard"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          </div>

          <div className="right-controls">
            <button 
              onClick={toggleMute}
              className={`control-btn ${isMuted ? 'danger' : ''}`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={toggleRecord}
              className={`control-btn ${isRecording ? 'recording' : ''}`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <button className="control-btn" title="More Options">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <div className="input-wrapper">
            <button className="attachment-btn" title="Attach File">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="message-textarea"
              rows="1"
            />
            
            <button className="emoji-btn" title="Add Emoji">
              <Smile className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="send-btn"
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <span className="recording-text">Recording...</span>
            <span className="recording-time">00:15</span>
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      {isKeyboardOpen && (
        <div className="virtual-keyboard">
          <div className="keyboard-header">
            <span className="font-medium">Virtual Keyboard</span>
            <button 
              onClick={toggleKeyboard}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="keyboard-layout">
            {/* Row 1 */}
            <div className="keyboard-row">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
                <button key={key} className="keyboard-key" onClick={() => setMessage(prev => prev + key)}>
                  {key}
                </button>
              ))}
            </div>
            {/* Row 2 */}
            <div className="keyboard-row">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                <button key={key} className="keyboard-key" onClick={() => setMessage(prev => prev + key)}>
                  {key}
                </button>
              ))}
            </div>
            {/* Row 3 */}
            <div className="keyboard-row">
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                <button key={key} className="keyboard-key" onClick={() => setMessage(prev => prev + key)}>
                  {key}
                </button>
              ))}
            </div>
            {/* Row 4 */}
            <div className="keyboard-row">
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                <button key={key} className="keyboard-key" onClick={() => setMessage(prev => prev + key)}>
                  {key}
                </button>
              ))}
            </div>
            {/* Row 5 */}
            <div className="keyboard-row">
              <button 
                className="keyboard-key space-key" 
                onClick={() => setMessage(prev => prev + ' ')}
              >
                Space
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactCallControls;


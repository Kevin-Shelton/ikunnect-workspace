import React, { useState, useEffect } from 'react';
import { Globe, Languages, Settings, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode, getLanguageName, getLanguageFlag, isRTLLanguage } from '../lib/translationService';

// =====================================================
// LANGUAGE SELECTOR COMPONENT
// =====================================================

export const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  label = "Language",
  showFlag = true,
  showNativeName = true,
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLang = getLanguageByCode(selectedLanguage);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md
          bg-white text-left cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center space-x-2">
          {showFlag && selectedLang && (
            <span className="text-lg">{selectedLang.flag}</span>
          )}
          <span className="text-sm">
            {selectedLang ? (
              <>
                {selectedLang.name}
                {showNativeName && selectedLang.nativeName !== selectedLang.name && (
                  <span className="text-gray-500 ml-1">({selectedLang.nativeName})</span>
                )}
              </>
            ) : (
              'Select language...'
            )}
          </span>
        </div>
        <Globe className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className={`
                  w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-gray-50
                  ${selectedLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                `}
              >
                {showFlag && <span className="text-lg">{language.flag}</span>}
                <div className="flex-1">
                  <div className="text-sm font-medium">{language.name}</div>
                  {showNativeName && language.nativeName !== language.name && (
                    <div className="text-xs text-gray-500">{language.nativeName}</div>
                  )}
                </div>
                <span className="text-xs text-gray-400 uppercase">{language.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// TRANSLATION TOGGLE COMPONENT
// =====================================================

export const TranslationToggle = ({ 
  enabled, 
  onToggle, 
  label = "Auto-translate",
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <Languages className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      
      <button
        type="button"
        onClick={() => !disabled && onToggle(!enabled)}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

// =====================================================
// TRANSLATION STATUS INDICATOR
// =====================================================

export const TranslationStatus = ({ 
  isTranslating, 
  confidence, 
  provider,
  processingTime,
  className = ""
}) => {
  if (isTranslating) {
    return (
      <div className={`flex items-center space-x-1 text-xs text-blue-600 ${className}`}>
        <div className="animate-spin h-3 w-3 border border-blue-600 border-t-transparent rounded-full"></div>
        <span>Translating...</span>
      </div>
    );
  }

  if (confidence) {
    const confidenceColor = confidence >= 0.9 ? 'text-green-600' : 
                           confidence >= 0.7 ? 'text-yellow-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center space-x-1 text-xs ${confidenceColor} ${className}`}>
        <Languages className="h-3 w-3" />
        <span>
          {Math.round(confidence * 100)}% confidence
          {provider && ` • ${provider}`}
          {processingTime && ` • ${processingTime}ms`}
        </span>
      </div>
    );
  }

  return null;
};

// =====================================================
// MULTILINGUAL MESSAGE COMPONENT
// =====================================================

export const MultilingualMessage = ({ 
  message, 
  showOriginal = true, 
  onToggleOriginal,
  onTranslate,
  targetLanguage,
  isAgent = false,
  className = ""
}) => {
  const [showingOriginal, setShowingOriginal] = useState(!message.auto_translated);
  const [isTranslating, setIsTranslating] = useState(false);

  const hasTranslation = message.translated_content && 
                        message.translated_content[targetLanguage];
  
  const displayText = showingOriginal ? 
                     (message.original_content || message.content) : 
                     (hasTranslation ? message.translated_content[targetLanguage] : message.content);

  const isRTL = isRTLLanguage(showingOriginal ? message.original_language : targetLanguage);

  const handleTranslate = async () => {
    if (!hasTranslation && onTranslate) {
      setIsTranslating(true);
      try {
        await onTranslate(message.id, message.original_language, targetLanguage);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const toggleView = () => {
    const newState = !showingOriginal;
    setShowingOriginal(newState);
    if (onToggleOriginal) {
      onToggleOriginal(newState);
    }
  };

  return (
    <div className={`${className}`}>
      {/* Message Content */}
      <div 
        className={`
          p-3 rounded-lg max-w-xs lg:max-w-md
          ${isAgent ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100 text-gray-900'}
          ${isRTL ? 'text-right' : 'text-left'}
        `}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="text-sm whitespace-pre-wrap">{displayText}</div>
        
        {/* Translation Controls */}
        {(message.original_language !== targetLanguage) && (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Language Indicator */}
              <span className="text-xs opacity-75">
                {getLanguageFlag(showingOriginal ? message.original_language : targetLanguage)}
                {getLanguageName(showingOriginal ? message.original_language : targetLanguage)}
              </span>
              
              {/* Translation Status */}
              <TranslationStatus 
                isTranslating={isTranslating}
                confidence={message.translation_confidence}
                provider={message.translation_provider}
                className="opacity-75"
              />
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Toggle Original/Translation */}
              {hasTranslation && showOriginal && (
                <button
                  onClick={toggleView}
                  className={`
                    p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors
                    ${isAgent ? 'text-white' : 'text-gray-600'}
                  `}
                  title={showingOriginal ? 'Show translation' : 'Show original'}
                >
                  {showingOriginal ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </button>
              )}
              
              {/* Translate Button */}
              {!hasTranslation && (
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className={`
                    p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors
                    ${isAgent ? 'text-white' : 'text-gray-600'}
                    ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  title="Translate message"
                >
                  <Languages className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Original Text Preview (when showing translation) */}
      {!showingOriginal && message.original_content && showOriginal && (
        <div className={`
          mt-1 text-xs opacity-60 italic
          ${isAgent ? 'text-right' : 'text-left'}
        `}>
          Original: {message.original_content.substring(0, 50)}
          {message.original_content.length > 50 && '...'}
        </div>
      )}
    </div>
  );
};

// =====================================================
// LANGUAGE SETTINGS PANEL
// =====================================================

export const LanguageSettingsPanel = ({ 
  conversation,
  onUpdateSettings,
  onClose,
  className = ""
}) => {
  const [settings, setSettings] = useState({
    customerLanguage: conversation?.customer_language || 'en',
    agentLanguage: conversation?.agent_language || 'en',
    autoTranslateCustomer: conversation?.translation_preferences?.auto_translate_customer ?? true,
    autoTranslateAgent: conversation?.translation_preferences?.auto_translate_agent ?? true,
    showOriginal: conversation?.translation_preferences?.show_original ?? true,
    translationProvider: conversation?.translation_preferences?.provider || 'onemeta'
  });

  const handleSave = () => {
    onUpdateSettings(settings);
    onClose();
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Translation Settings
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Customer Language */}
        <LanguageSelector
          label="Customer Language"
          selectedLanguage={settings.customerLanguage}
          onLanguageChange={(lang) => setSettings(prev => ({ ...prev, customerLanguage: lang }))}
        />

        {/* Agent Language */}
        <LanguageSelector
          label="Agent Language"
          selectedLanguage={settings.agentLanguage}
          onLanguageChange={(lang) => setSettings(prev => ({ ...prev, agentLanguage: lang }))}
        />

        {/* Translation Options */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <TranslationToggle
            label="Auto-translate customer messages"
            enabled={settings.autoTranslateCustomer}
            onToggle={(enabled) => setSettings(prev => ({ ...prev, autoTranslateCustomer: enabled }))}
          />

          <TranslationToggle
            label="Auto-translate agent messages"
            enabled={settings.autoTranslateAgent}
            onToggle={(enabled) => setSettings(prev => ({ ...prev, autoTranslateAgent: enabled }))}
          />

          <TranslationToggle
            label="Show original text"
            enabled={settings.showOriginal}
            onToggle={(enabled) => setSettings(prev => ({ ...prev, showOriginal: enabled }))}
          />
        </div>

        {/* Translation Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Translation Provider
          </label>
          <select
            value={settings.translationProvider}
            onChange={(e) => setSettings(prev => ({ ...prev, translationProvider: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="onemeta">OneMeta™ (Recommended)</option>
            <option value="google">Google Translate</option>
            <option value="mock">Demo Mode</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            OneMeta™ provides the highest quality translations with 150+ languages
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// LANGUAGE DETECTION BANNER
// =====================================================

export const LanguageDetectionBanner = ({ 
  detectedLanguage, 
  confidence, 
  onAccept, 
  onDismiss,
  className = ""
}) => {
  const language = getLanguageByCode(detectedLanguage);
  
  if (!language || confidence < 0.7) return null;

  return (
    <div className={`
      bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between
      ${className}
    `}>
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-blue-600" />
        <span className="text-sm text-blue-800">
          Detected language: <strong>{language.flag} {language.name}</strong>
          <span className="text-blue-600 ml-1">({Math.round(confidence * 100)}% confidence)</span>
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onAccept}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Use This Language
        </button>
        <button
          onClick={onDismiss}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

// =====================================================
// QUICK LANGUAGE SWITCHER
// =====================================================

export const QuickLanguageSwitcher = ({ 
  currentLanguage, 
  onLanguageChange, 
  recentLanguages = [],
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get most common languages plus recent ones
  const quickLanguages = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ar', 'hi'
  ].concat(recentLanguages.filter(lang => !['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ar', 'hi'].includes(lang)));

  const currentLang = getLanguageByCode(currentLanguage);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        title="Quick language switch"
      >
        <span className="text-sm">{currentLang?.flag}</span>
        <span className="text-xs text-gray-600">{currentLang?.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-max">
          <div className="p-1">
            {quickLanguages.slice(0, 10).map((langCode) => {
              const lang = getLanguageByCode(langCode);
              if (!lang) return null;
              
              return (
                <button
                  key={langCode}
                  onClick={() => {
                    onLanguageChange(langCode);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-2 px-2 py-1 text-left rounded hover:bg-gray-50
                    ${currentLanguage === langCode ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  <span className="text-xs text-gray-400">{lang.code.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// TRANSLATION QUALITY INDICATOR
// =====================================================

export const TranslationQualityIndicator = ({ 
  confidence, 
  provider,
  className = ""
}) => {
  const getQualityLevel = (confidence) => {
    if (confidence >= 0.95) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (confidence >= 0.85) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (confidence >= 0.70) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const quality = getQualityLevel(confidence);

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${quality.bg} ${quality.color} ${className}`}>
      <Languages className="h-3 w-3" />
      <span>{quality.level}</span>
      <span className="opacity-75">({Math.round(confidence * 100)}%)</span>
      {provider && (
        <span className="opacity-75">• {provider}</span>
      )}
    </div>
  );
};

export default {
  LanguageSelector,
  TranslationToggle,
  TranslationStatus,
  MultilingualMessage,
  LanguageSettingsPanel,
  LanguageDetectionBanner,
  QuickLanguageSwitcher,
  TranslationQualityIndicator
};


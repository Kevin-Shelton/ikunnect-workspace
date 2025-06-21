// iKunnect Translation Service - Powered by OneMeta™
// Comprehensive translation and language detection service

// =====================================================
// TRANSLATION PROVIDERS
// =====================================================

class TranslationProvider {
  constructor(name, apiKey, baseUrl) {
    this.name = name;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async translate(text, sourceLang, targetLang) {
    throw new Error('translate method must be implemented');
  }

  async detectLanguage(text) {
    throw new Error('detectLanguage method must be implemented');
  }
}

// Google Translate Provider
class GoogleTranslateProvider extends TranslationProvider {
  constructor(apiKey) {
    super('google', apiKey, 'https://translation.googleapis.com/language/translate/v2');
  }

  async translate(text, sourceLang, targetLang) {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        translatedText: data.data.translations[0].translatedText,
        confidence: 0.95,
        detectedSourceLanguage: data.data.translations[0].detectedSourceLanguage
      };
    } catch (error) {
      console.error('Google Translate error:', error);
      throw error;
    }
  }

  async detectLanguage(text) {
    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const detection = data.data.detections[0][0];
      return {
        language: detection.language,
        confidence: detection.confidence
      };
    } catch (error) {
      console.error('Google Detect error:', error);
      throw error;
    }
  }
}

// OneMeta Translation Provider (Verbum Call Integration)
class OneMetaProvider extends TranslationProvider {
  constructor(apiKey) {
    super('onemeta', apiKey, 'https://api.onemeta.ai/v1');
  }

  async translate(text, sourceLang, targetLang) {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source_language: sourceLang,
          target_language: targetLang,
          model: 'verbum-call-v2',
          preserve_formatting: true
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      return {
        translatedText: data.translated_text,
        confidence: data.confidence || 0.95,
        detectedSourceLanguage: data.detected_language,
        processingTime: data.processing_time_ms
      };
    } catch (error) {
      console.error('OneMeta Translate error:', error);
      throw error;
    }
  }

  async detectLanguage(text) {
    try {
      const response = await fetch(`${this.baseUrl}/detect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model: 'language-detector-v2'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Language detection failed');
      }

      return {
        language: data.detected_language,
        confidence: data.confidence,
        alternatives: data.alternatives || []
      };
    } catch (error) {
      console.error('OneMeta Detect error:', error);
      throw error;
    }
  }
}

// Fallback/Mock Provider for development
class MockTranslationProvider extends TranslationProvider {
  constructor() {
    super('mock', null, null);
    
    // Simple translation mappings for demo
    this.translations = {
      'en-es': {
        'Hello': 'Hola',
        'How can I help you?': '¿Cómo puedo ayudarte?',
        'Thank you': 'Gracias',
        'Goodbye': 'Adiós',
        'Yes': 'Sí',
        'No': 'No',
        'Please wait': 'Por favor espera',
        'I understand': 'Entiendo'
      },
      'en-fr': {
        'Hello': 'Bonjour',
        'How can I help you?': 'Comment puis-je vous aider?',
        'Thank you': 'Merci',
        'Goodbye': 'Au revoir',
        'Yes': 'Oui',
        'No': 'Non',
        'Please wait': 'Veuillez patienter',
        'I understand': 'Je comprends'
      },
      'es-en': {
        'Hola': 'Hello',
        '¿Cómo puedo ayudarte?': 'How can I help you?',
        'Gracias': 'Thank you',
        'Adiós': 'Goodbye',
        'Sí': 'Yes',
        'No': 'No',
        'Por favor espera': 'Please wait',
        'Entiendo': 'I understand'
      },
      'fr-en': {
        'Bonjour': 'Hello',
        'Comment puis-je vous aider?': 'How can I help you?',
        'Merci': 'Thank you',
        'Au revoir': 'Goodbye',
        'Oui': 'Yes',
        'Non': 'No',
        'Veuillez patienter': 'Please wait',
        'Je comprends': 'I understand'
      }
    };
  }

  async translate(text, sourceLang, targetLang) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const key = `${sourceLang}-${targetLang}`;
    const translation = this.translations[key]?.[text] || `[${targetLang.toUpperCase()}] ${text}`;
    
    return {
      translatedText: translation,
      confidence: 0.85,
      detectedSourceLanguage: sourceLang
    };
  }

  async detectLanguage(text) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simple pattern-based detection
    if (/[ñáéíóúü]/.test(text)) {
      return { language: 'es', confidence: 0.85 };
    } else if (/[àâäéèêëïîôöùûüÿç]/.test(text)) {
      return { language: 'fr', confidence: 0.80 };
    } else if (/[äöüß]/.test(text)) {
      return { language: 'de', confidence: 0.80 };
    } else if (/[а-яё]/.test(text)) {
      return { language: 'ru', confidence: 0.90 };
    } else if (/[一-龯]/.test(text)) {
      return { language: 'zh', confidence: 0.85 };
    } else if (/[ひらがなカタカナ]/.test(text)) {
      return { language: 'ja', confidence: 0.90 };
    } else if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(text)) {
      return { language: 'ko', confidence: 0.90 };
    } else if (/[ا-ي]/.test(text)) {
      return { language: 'ar', confidence: 0.85 };
    } else {
      return { language: 'en', confidence: 0.70 };
    }
  }
}

// =====================================================
// MAIN TRANSLATION SERVICE
// =====================================================

class TranslationService {
  constructor() {
    this.providers = new Map();
    this.defaultProvider = 'mock';
    this.cache = new Map();
    this.maxCacheSize = 1000;
    
    // Initialize providers
    this.initializeProviders();
  }

  initializeProviders() {
    // Mock provider (always available for development)
    this.providers.set('mock', new MockTranslationProvider());
    
    // Google Translate (if API key available)
    const googleApiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    if (googleApiKey) {
      this.providers.set('google', new GoogleTranslateProvider(googleApiKey));
      this.defaultProvider = 'google';
    }
    
    // OneMeta provider (if API key available)
    const oneMetaApiKey = import.meta.env.VITE_ONEMETA_API_KEY;
    if (oneMetaApiKey) {
      this.providers.set('onemeta', new OneMetaProvider(oneMetaApiKey));
      this.defaultProvider = 'onemeta'; // Prefer OneMeta for quality
    }
  }

  getCacheKey(text, sourceLang, targetLang, provider) {
    return `${provider}:${sourceLang}-${targetLang}:${text}`;
  }

  async translate(text, sourceLang, targetLang, providerName = null) {
    if (!text || !text.trim()) {
      return { translatedText: text, confidence: 1.0 };
    }

    if (sourceLang === targetLang) {
      return { translatedText: text, confidence: 1.0 };
    }

    const provider = providerName || this.defaultProvider;
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang, provider);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const translationProvider = this.providers.get(provider);
      if (!translationProvider) {
        throw new Error(`Translation provider '${provider}' not available`);
      }

      const startTime = Date.now();
      const result = await translationProvider.translate(text, sourceLang, targetLang);
      const processingTime = Date.now() - startTime;

      const translationResult = {
        ...result,
        provider,
        processingTime,
        cached: false
      };

      // Cache the result
      this.addToCache(cacheKey, translationResult);

      return translationResult;
    } catch (error) {
      console.error(`Translation failed with ${provider}:`, error);
      
      // Fallback to mock provider if main provider fails
      if (provider !== 'mock') {
        console.log('Falling back to mock provider');
        return this.translate(text, sourceLang, targetLang, 'mock');
      }
      
      throw error;
    }
  }

  async detectLanguage(text, providerName = null) {
    if (!text || !text.trim()) {
      return { language: 'en', confidence: 0.5 };
    }

    const provider = providerName || this.defaultProvider;
    
    try {
      const translationProvider = this.providers.get(provider);
      if (!translationProvider) {
        throw new Error(`Translation provider '${provider}' not available`);
      }

      const result = await translationProvider.detectLanguage(text);
      return {
        ...result,
        provider
      };
    } catch (error) {
      console.error(`Language detection failed with ${provider}:`, error);
      
      // Fallback to mock provider
      if (provider !== 'mock') {
        return this.detectLanguage(text, 'mock');
      }
      
      throw error;
    }
  }

  addToCache(key, value) {
    // Simple LRU cache implementation
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, { ...value, cached: true });
  }

  clearCache() {
    this.cache.clear();
  }

  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  setDefaultProvider(providerName) {
    if (this.providers.has(providerName)) {
      this.defaultProvider = providerName;
    } else {
      throw new Error(`Provider '${providerName}' not available`);
    }
  }
}

// =====================================================
// LANGUAGE UTILITIES
// =====================================================

export const SUPPORTED_LANGUAGES = [
  // Major World Languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  
  // Additional European Languages
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  
  // Asian Languages
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', flag: '🇰🇭' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', flag: '🇱🇦' },
  
  // Indian Languages
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  
  // Southeast Asian Languages
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  
  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' }
];

export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLanguageName = (code, native = false) => {
  const language = getLanguageByCode(code);
  return language ? (native ? language.nativeName : language.name) : code.toUpperCase();
};

export const getLanguageFlag = (code) => {
  const language = getLanguageByCode(code);
  return language ? language.flag : '🌐';
};

export const isRTLLanguage = (code) => {
  return ['ar', 'he', 'fa', 'ur'].includes(code);
};

// =====================================================
// EXPORT SINGLETON INSTANCE
// =====================================================

export const translationService = new TranslationService();
export default translationService;


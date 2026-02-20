import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.diseases': 'Diseases',
    'nav.howItWorks': 'How It Works',
    'nav.scanNow': 'Scan Now',
    
    // Hero Section
    'hero.title': 'Protect Your Crops with',
    'hero.titleHighlight': 'AI-Powered',
    'hero.titleEnd': 'Disease Detection',
    'hero.subtitle': 'Upload a photo of your crop and get instant disease diagnosis with treatment recommendations. Helping farmers protect their harvest.',
    'hero.scanButton': 'Scan Your Crop',
    'hero.learnMore': 'Learn More',
    
    // Features Section
    'features.title': 'Why Choose CropGuard?',
    'features.subtitle': 'Advanced AI technology to help farmers identify and treat crop diseases quickly and accurately.',
    'features.instant.title': 'Instant Detection',
    'features.instant.desc': 'Get disease identification results within seconds using our advanced AI model.',
    'features.accurate.title': 'Highly Accurate',
    'features.accurate.desc': '95%+ accuracy in identifying common crop diseases across multiple plant species.',
    'features.treatment.title': 'Treatment Guide',
    'features.treatment.desc': 'Receive detailed treatment recommendations and prevention tips for each disease.',
    'features.offline.title': 'Works Offline',
    'features.offline.desc': 'Basic functionality available even without internet connection.',
    'features.multi.title': 'Multi-Crop Support',
    'features.multi.desc': 'Supports analysis for rice, wheat, cotton, tomato, and many more crops.',
    'features.free.title': 'Free to Use',
    'features.free.desc': 'Basic disease detection is completely free for all farmers.',
    
    // Upload Section
    'upload.title': 'Scan Your Crop Now',
    'upload.subtitle': 'Upload an image of your crop leaf to detect diseases instantly using AI.',
    'upload.dropHere': 'Drop your image here',
    'upload.orClick': 'or click to browse from your device',
    'upload.supports': 'Supports JPG, PNG, WEBP up to 10MB',
    'upload.analyze': 'Analyze Image',
    'upload.analyzing': 'Analyzing with AI...',
    'upload.results': 'Analysis Results',
    'upload.uploadPrompt': 'Upload an image to see the analysis results',
    'upload.analyzePrompt': 'Click "Analyze Image" to detect diseases',
    'upload.aiAnalyzing': 'AI is analyzing your crop image...',
    'upload.wait': 'This may take a few seconds',
    'upload.diseaseDetected': 'Disease Detected',
    'upload.noDisease': 'No disease detected',
    'upload.confidence': 'Confidence',
    'upload.severity': 'Severity',
    'upload.symptoms': 'Symptoms Observed',
    'upload.treatment': 'Recommended Treatment',
    'upload.prevention': 'Prevention Tips',
    'upload.scanAnother': 'Scan Another Image',
    'upload.readAloud': 'Read Aloud',
    'upload.reading': 'Reading...',
    'upload.stopReading': 'Stop Reading',
    
    // Diseases Section
    'diseases.title': 'Common Crop Diseases',
    'diseases.subtitle': 'Learn about the most common diseases affecting crops and how to identify them.',
    
    // How It Works
    'howItWorks.title': 'How It Works',
    'howItWorks.subtitle': 'Three simple steps to protect your crops from diseases.',
    'howItWorks.step1.title': 'Take a Photo',
    'howItWorks.step1.desc': 'Capture a clear image of the affected crop leaf or plant part.',
    'howItWorks.step2.title': 'AI Analysis',
    'howItWorks.step2.desc': 'Our AI analyzes the image and identifies potential diseases.',
    'howItWorks.step3.title': 'Get Results',
    'howItWorks.step3.desc': 'Receive disease diagnosis with treatment recommendations.',
    
    // Footer
    'footer.description': 'AI-powered crop disease detection helping farmers protect their harvest.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    
    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    
    // Language
    'language': 'Language',
  },
  hi: {
    // Header
    'nav.home': 'होम',
    'nav.features': 'विशेषताएं',
    'nav.diseases': 'रोग',
    'nav.howItWorks': 'कैसे काम करता है',
    'nav.scanNow': 'अभी स्कैन करें',
    
    // Hero Section
    'hero.title': 'अपनी फसलों की रक्षा करें',
    'hero.titleHighlight': 'AI-संचालित',
    'hero.titleEnd': 'रोग पहचान के साथ',
    'hero.subtitle': 'अपनी फसल की फोटो अपलोड करें और उपचार सुझावों के साथ तुरंत रोग निदान प्राप्त करें। किसानों की फसल बचाने में मदद।',
    'hero.scanButton': 'फसल स्कैन करें',
    'hero.learnMore': 'और जानें',
    
    // Features Section
    'features.title': 'क्रॉपगार्ड क्यों चुनें?',
    'features.subtitle': 'किसानों को फसल रोगों की पहचान और उपचार में मदद करने के लिए उन्नत AI तकनीक।',
    'features.instant.title': 'तुरंत पहचान',
    'features.instant.desc': 'हमारे उन्नत AI मॉडल का उपयोग करके सेकंडों में रोग पहचान परिणाम प्राप्त करें।',
    'features.accurate.title': 'उच्च सटीकता',
    'features.accurate.desc': 'कई पौधों की प्रजातियों में सामान्य फसल रोगों की पहचान में 95%+ सटीकता।',
    'features.treatment.title': 'उपचार गाइड',
    'features.treatment.desc': 'प्रत्येक रोग के लिए विस्तृत उपचार सुझाव और रोकथाम टिप्स प्राप्त करें।',
    'features.offline.title': 'ऑफलाइन काम करता है',
    'features.offline.desc': 'इंटरनेट कनेक्शन के बिना भी बुनियादी कार्यक्षमता उपलब्ध।',
    'features.multi.title': 'बहु-फसल समर्थन',
    'features.multi.desc': 'चावल, गेहूं, कपास, टमाटर और कई अन्य फसलों के विश्लेषण का समर्थन करता है।',
    'features.free.title': 'मुफ्त उपयोग',
    'features.free.desc': 'सभी किसानों के लिए बुनियादी रोग पहचान पूरी तरह से मुफ्त है।',
    
    // Upload Section
    'upload.title': 'अभी अपनी फसल स्कैन करें',
    'upload.subtitle': 'AI का उपयोग करके तुरंत रोगों का पता लगाने के लिए अपनी फसल की पत्ती की तस्वीर अपलोड करें।',
    'upload.dropHere': 'अपनी तस्वीर यहां डालें',
    'upload.orClick': 'या अपने डिवाइस से ब्राउज़ करने के लिए क्लिक करें',
    'upload.supports': 'JPG, PNG, WEBP 10MB तक समर्थित',
    'upload.analyze': 'तस्वीर का विश्लेषण करें',
    'upload.analyzing': 'AI के साथ विश्लेषण हो रहा है...',
    'upload.results': 'विश्लेषण परिणाम',
    'upload.uploadPrompt': 'विश्लेषण परिणाम देखने के लिए तस्वीर अपलोड करें',
    'upload.analyzePrompt': 'रोगों का पता लगाने के लिए "तस्वीर का विश्लेषण करें" पर क्लिक करें',
    'upload.aiAnalyzing': 'AI आपकी फसल की तस्वीर का विश्लेषण कर रहा है...',
    'upload.wait': 'इसमें कुछ सेकंड लग सकते हैं',
    'upload.diseaseDetected': 'रोग पाया गया',
    'upload.noDisease': 'कोई रोग नहीं पाया गया',
    'upload.confidence': 'विश्वास',
    'upload.severity': 'गंभीरता',
    'upload.symptoms': 'देखे गए लक्षण',
    'upload.treatment': 'अनुशंसित उपचार',
    'upload.prevention': 'रोकथाम के सुझाव',
    'upload.scanAnother': 'एक और तस्वीर स्कैन करें',
    'upload.readAloud': 'जोर से पढ़ें',
    'upload.reading': 'पढ़ रहा है...',
    'upload.stopReading': 'पढ़ना बंद करें',
    
    // Diseases Section
    'diseases.title': 'सामान्य फसल रोग',
    'diseases.subtitle': 'फसलों को प्रभावित करने वाले सबसे आम रोगों और उन्हें कैसे पहचानें, इसके बारे में जानें।',
    
    // How It Works
    'howItWorks.title': 'यह कैसे काम करता है',
    'howItWorks.subtitle': 'अपनी फसलों को रोगों से बचाने के तीन सरल कदम।',
    'howItWorks.step1.title': 'फोटो लें',
    'howItWorks.step1.desc': 'प्रभावित फसल की पत्ती या पौधे के हिस्से की स्पष्ट तस्वीर लें।',
    'howItWorks.step2.title': 'AI विश्लेषण',
    'howItWorks.step2.desc': 'हमारा AI तस्वीर का विश्लेषण करता है और संभावित रोगों की पहचान करता है।',
    'howItWorks.step3.title': 'परिणाम प्राप्त करें',
    'howItWorks.step3.desc': 'उपचार सुझावों के साथ रोग निदान प्राप्त करें।',
    
    // Footer
    'footer.description': 'AI-संचालित फसल रोग पहचान किसानों की फसल बचाने में मदद करती है।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.contact': 'संपर्क',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    
    // Theme
    'theme.light': 'लाइट',
    'theme.dark': 'डार्क',
    'theme.system': 'सिस्टम',
    
    // Language
    'language': 'भाषा',
  },
  te: {
    // Header
    'nav.home': 'హోమ్',
    'nav.features': 'ఫీచర్లు',
    'nav.diseases': 'వ్యాధులు',
    'nav.howItWorks': 'ఎలా పనిచేస్తుంది',
    'nav.scanNow': 'ఇప్పుడు స్కాన్ చేయండి',
    
    // Hero Section
    'hero.title': 'మీ పంటలను రక్షించుకోండి',
    'hero.titleHighlight': 'AI-ఆధారిత',
    'hero.titleEnd': 'వ్యాధి గుర్తింపుతో',
    'hero.subtitle': 'మీ పంట ఫోటో అప్‌లోడ్ చేసి చికిత్స సిఫార్సులతో తక్షణ వ్యాధి నిర్ధారణ పొందండి. రైతుల పంటను రక్షించడంలో సహాయం.',
    'hero.scanButton': 'పంట స్కాన్ చేయండి',
    'hero.learnMore': 'మరింత తెలుసుకోండి',
    
    // Features Section
    'features.title': 'క్రాప్‌గార్డ్ ఎందుకు ఎంచుకోవాలి?',
    'features.subtitle': 'రైతులకు పంట వ్యాధులను గుర్తించడంలో మరియు చికిత్స చేయడంలో సహాయపడే అధునాతన AI సాంకేతికత.',
    'features.instant.title': 'తక్షణ గుర్తింపు',
    'features.instant.desc': 'మా అధునాతన AI మోడల్ ఉపయోగించి సెకన్లలో వ్యాధి గుర్తింపు ఫలితాలు పొందండి.',
    'features.accurate.title': 'అధిక ఖచ్చితత్వం',
    'features.accurate.desc': 'అనేక మొక్కల జాతులలో సాధారణ పంట వ్యాధులను గుర్తించడంలో 95%+ ఖచ్చితత్వం.',
    'features.treatment.title': 'చికిత్స గైడ్',
    'features.treatment.desc': 'ప్రతి వ్యాధికి వివరణాత్మక చికిత్స సిఫార్సులు మరియు నివారణ చిట్కాలు పొందండి.',
    'features.offline.title': 'ఆఫ్‌లైన్‌లో పనిచేస్తుంది',
    'features.offline.desc': 'ఇంటర్నెట్ కనెక్షన్ లేకుండా కూడా ప్రాథమిక కార్యాచరణ అందుబాటులో ఉంటుంది.',
    'features.multi.title': 'బహుళ-పంట మద్దతు',
    'features.multi.desc': 'వరి, గోధుమ, పత్తి, టమాటా మరియు అనేక ఇతర పంటల విశ్లేషణకు మద్దతు.',
    'features.free.title': 'ఉచితంగా ఉపయోగించండి',
    'features.free.desc': 'అన్ని రైతులకు ప్రాథమిక వ్యాధి గుర్తింపు పూర్తిగా ఉచితం.',
    
    // Upload Section
    'upload.title': 'ఇప్పుడే మీ పంట స్కాన్ చేయండి',
    'upload.subtitle': 'AI ఉపయోగించి తక్షణంగా వ్యాధులను గుర్తించడానికి మీ పంట ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి.',
    'upload.dropHere': 'మీ చిత్రాన్ని ఇక్కడ వదలండి',
    'upload.orClick': 'లేదా మీ పరికరం నుండి బ్రౌజ్ చేయడానికి క్లిక్ చేయండి',
    'upload.supports': 'JPG, PNG, WEBP 10MB వరకు మద్దతు',
    'upload.analyze': 'చిత్రాన్ని విశ్లేషించండి',
    'upload.analyzing': 'AIతో విశ్లేషిస్తోంది...',
    'upload.results': 'విశ్లేషణ ఫలితాలు',
    'upload.uploadPrompt': 'విశ్లేషణ ఫలితాలు చూడటానికి చిత్రాన్ని అప్‌లోడ్ చేయండి',
    'upload.analyzePrompt': 'వ్యాధులను గుర్తించడానికి "చిత్రాన్ని విశ్లేషించండి" క్లిక్ చేయండి',
    'upload.aiAnalyzing': 'AI మీ పంట చిత్రాన్ని విశ్లేషిస్తోంది...',
    'upload.wait': 'దీనికి కొన్ని సెకన్లు పట్టవచ్చు',
    'upload.diseaseDetected': 'వ్యాధి గుర్తించబడింది',
    'upload.noDisease': 'వ్యాధి గుర్తించబడలేదు',
    'upload.confidence': 'విశ్వాసం',
    'upload.severity': 'తీవ్రత',
    'upload.symptoms': 'గమనించిన లక్షణాలు',
    'upload.treatment': 'సిఫార్సు చేసిన చికిత్స',
    'upload.prevention': 'నివారణ చిట్కాలు',
    'upload.scanAnother': 'మరొక చిత్రాన్ని స్కాన్ చేయండి',
    'upload.readAloud': 'బిగ్గరగా చదవండి',
    'upload.reading': 'చదువుతోంది...',
    'upload.stopReading': 'చదవడం ఆపండి',
    
    // Diseases Section
    'diseases.title': 'సాధారణ పంట వ్యాధులు',
    'diseases.subtitle': 'పంటలను ప్రభావితం చేసే అత్యంత సాధారణ వ్యాధులు మరియు వాటిని ఎలా గుర్తించాలో తెలుసుకోండి.',
    
    // How It Works
    'howItWorks.title': 'ఇది ఎలా పనిచేస్తుంది',
    'howItWorks.subtitle': 'మీ పంటలను వ్యాధుల నుండి రక్షించడానికి మూడు సరళమైన దశలు.',
    'howItWorks.step1.title': 'ఫోటో తీయండి',
    'howItWorks.step1.desc': 'ప్రభావితమైన పంట ఆకు లేదా మొక్క భాగం యొక్క స్పష్టమైన చిత్రాన్ని తీయండి.',
    'howItWorks.step2.title': 'AI విశ్లేషణ',
    'howItWorks.step2.desc': 'మా AI చిత్రాన్ని విశ్లేషిస్తుంది మరియు సంభావ్య వ్యాధులను గుర్తిస్తుంది.',
    'howItWorks.step3.title': 'ఫలితాలు పొందండి',
    'howItWorks.step3.desc': 'చికిత్స సిఫార్సులతో వ్యాధి నిర్ధారణ పొందండి.',
    
    // Footer
    'footer.description': 'AI-ఆధారిత పంట వ్యాధి గుర్తింపు రైతుల పంటను రక్షించడంలో సహాయపడుతుంది.',
    'footer.quickLinks': 'త్వరిత లింక్‌లు',
    'footer.contact': 'సంప్రదించండి',
    'footer.rights': 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
    
    // Theme
    'theme.light': 'లైట్',
    'theme.dark': 'డార్క్',
    'theme.system': 'సిస్టమ్',
    
    // Language
    'language': 'భాష',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

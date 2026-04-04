// ShieldRide i18n System - Multilingual Support (English, Hindi, Kannada)

export type LanguageCode = 'en-IN' | 'hi-IN' | 'kn-IN';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  fontFamily: string;
  displayFontFamily: string;
}

export interface I18nStrings {
  [key: string]: string;
  // App & Common
  appName: string;
  appTagline: string;
  loading: string;
  error: string;
  retry: string;
  cancel: string;
  confirm: string;
  continue: string;
  back: string;
  next: string;
  skip: string;
  save: string;
  edit: string;
  delete: string;
  close: string;
  week: string;

  // Language Selection
  selectLanguage: string;
  selectLanguageDesc: string;

  // Auth
  login: string;
  signup: string;
  logout: string;
  mobileNumber: string;
  enterMobile: string;
  sendOtp: string;
  enterOtp: string;
  otpSent: string;
  resendOtp: string;
  verifyOtp: string;
  invalidMobile: string;
  invalidOtp: string;
  loginSuccess: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  partnerId: string;
  enterPartnerId: string;
  fullName: string;
  enterFullName: string;

  // Signup / Coverage
  chooseCoverage: string;
  coverageDesc: string;
  basic: string;
  standard: string;
  premium: string;
  basicDesc: string;
  standardDesc: string;
  premiumDesc: string;
  perDay: string;
  selectPlan: string;
  planSelected: string;
  dailyProtection: string;
  triggersCovered: string;
  autoPayout: string;

  // Triggers
  Rainfall: string;
  Heat: string;
  AQI: string;
  Platform: string;
  Internet: string;
  Fuel: string;
  Incentive: string;
  Wind: string;
  Hail: string;

  // Location
  detectLocation: string;
  locationDesc: string;
  detecting: string;
  locationDetected: string;
  currentZone: string;
  darkStore: string;
  zone: string;
  allowLocation: string;
  locationDenied: string;

  // Home / Dashboard
  dashboard: string;
  workerView: string;
  insurerView: string;
  switchToInsurer: string;
  switchToWorker: string;
  totalPolicies: string;
  totalClaims: string;
  pendingClaims: string;
  totalEarned: string;
  fileClaim: string;
  settings: string;

  // Shield Status
  shieldActive: string;
  shieldInactive: string;
  shieldPaused: string;
  yourShield: string;
  activeSince: string;
  activeSincePetti: string;
  latestOrderDelivered: string;
  expiresOn: string;
  daysRemaining: string;
  todaysEarnings: string;
  coverageAmount: string;
  loginNote: string;

  // Policy Explanation
  policyTitle: string;
  policyExplanation: string;
  severity: string;
  payoutAmount: string;
  simulationTitle: string;
  understandPolicy: string;

  // Voice Assistant
  voiceAssistant: string;
  tapToSpeak: string;
  listening: string;
  processing: string;
  speaking: string;
  askQuestion: string;
  commonQuestions: string;
  q1Coverage: string;
  q2Claim: string;
  q3Payment: string;
  q4Accident: string;

  // Insurer Specific
  lossRatio: string;
  reserveForecast: string;
  fraudDetection: string;
  lastUpdated: string;
  noTriggers: string;
  noClaims: string;
  inReview: string;
  active: string;
  pending: string;
  resolved: string;
  warning: string;
}

export const LANGUAGE_CONFIGS: Record<LanguageCode, LanguageConfig> = {
  'en-IN': {
    code: 'en-IN',
    name: 'English',
    nativeName: 'English',
    flag: '🇮🇳',
    direction: 'ltr',
    fontFamily: "'Manrope', 'Noto Sans', sans-serif",
    displayFontFamily: "'Sora', 'Manrope', sans-serif",
  },
  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    fontFamily: "'Noto Sans Devanagari', 'Mukta', sans-serif",
    displayFontFamily: "'Noto Sans Devanagari', 'Mukta', sans-serif",
  },
  'kn-IN': {
    code: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    direction: 'ltr',
    fontFamily: "'Noto Sans Kannada', 'Tiro Kannada', sans-serif",
    displayFontFamily: "'Noto Sans Kannada', 'Tiro Kannada', sans-serif",
  },
};

const TRANSLATIONS: Record<LanguageCode, I18nStrings> = {
  'en-IN': {
    appName: 'ShieldRide',
    appTagline: 'Income Protection for Delivery Partners',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    week: 'week',

    selectLanguage: 'Select Language',
    selectLanguageDesc: 'Choose your preferred language for the app',

    login: 'Login',
    signup: 'Signup',
    logout: 'Logout',
    mobileNumber: 'Mobile Number',
    enterMobile: 'Enter 10-digit mobile number',
    sendOtp: 'Send OTP',
    enterOtp: 'Enter 6-digit OTP',
    otpSent: 'OTP sent to',
    resendOtp: 'Resend OTP',
    verifyOtp: 'Verify OTP',
    invalidMobile: 'Please enter a valid 10-digit mobile number',
    invalidOtp: 'Invalid OTP. Please try again',
    loginSuccess: 'Login successful',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    partnerId: 'Blinkit Partner ID',
    enterPartnerId: 'Enter your partner ID (e.g., BLK-BLR-047)',
    fullName: 'Full Name',
    enterFullName: 'Enter your full name',

    chooseCoverage: 'Choose Your Protection',
    coverageDesc: 'Select a plan that fits your daily earnings',
    basic: 'Basic',
    standard: 'Standard',
    premium: 'Premium',
    basicDesc: 'Essential protection for rainy days',
    standardDesc: 'Complete protection for all disruption events',
    premiumDesc: 'Maximum protection for highest earnings',
    perDay: 'per day',
    selectPlan: 'Select Plan',
    planSelected: 'Plan Selected',
    dailyProtection: 'daily protection',
    triggersCovered: 'triggers covered',
    autoPayout: 'Automatic UPI Payout',

    Rainfall: 'Rainfall',
    Heat: 'Extreme Heat',
    AQI: 'Severe AQI',
    Platform: 'Hub Downtime',
    Internet: 'Internet Outage',
    Fuel: 'Fuel Surge',
    Incentive: 'Incentive Drop',
    Wind: 'High Wind',
    Hail: 'Hailstorm',

    detectLocation: 'Detect Location',
    locationDesc: 'We need your location to link your assigned Dark Store',
    detecting: 'Detecting your zone...',
    locationDetected: 'Location Detected',
    currentZone: 'Current Zone',
    darkStore: 'Assigned Dark Store',
    zone: 'Zone',
    allowLocation: 'Allow Location Access',
    locationDenied: 'Location access denied. Please enable it in settings.',

    dashboard: 'Dashboard',
    workerView: 'Worker View',
    insurerView: 'Insurer View',
    switchToInsurer: 'Switch to Insurer',
    switchToWorker: 'Switch to Worker',
    totalPolicies: 'Total Policies',
    totalClaims: 'Total Claims',
    pendingClaims: 'Pending Claims',
    totalEarned: 'Total Protected Income',
    fileClaim: 'No Action Needed',
    settings: 'Settings',

    shieldActive: 'Shield Active',
    shieldInactive: 'Shield Inactive',
    shieldPaused: 'Shield Paused',
    yourShield: 'Your Shield',
    activeSince: 'Active Since',
    activeSincePetti: 'Active Since Petti',
    latestOrderDelivered: 'Latest Order Delivered',
    expiresOn: 'Expires On',
    daysRemaining: 'days remaining',
    todaysEarnings: "Today's Earnings",
    coverageAmount: 'Coverage Amount',
    loginNote: 'Note: Use any 10 digit number and 6 digit OTP',

    policyTitle: 'Policy Explanation',
    policyExplanation: 'Your parametric insurance pays out based on event severity. No claims needed.',
    severity: 'Severity',
    payoutAmount: 'Payout Amount',
    simulationTitle: 'Payout Simulator',
    understandPolicy: 'I Understand',

    voiceAssistant: 'Voice Assistant',
    tapToSpeak: 'Tap to Speak',
    listening: 'Listening...',
    processing: 'Processing...',
    speaking: 'Speaking...',
    askQuestion: 'Ask anything about your coverage',
    commonQuestions: 'Common Questions',
    q1Coverage: 'What does my plan cover?',
    q2Claim: 'How do I file a claim?',
    q3Payment: 'When will I get paid?',
    q4Accident: 'What if I have an accident?',

    lossRatio: 'Loss Ratio',
    reserveForecast: 'Reserve Forecast',
    fraudDetection: 'Fraud Detection',
    lastUpdated: 'Last Updated',
    noTriggers: 'No active triggers in your zone',
    noClaims: 'No claims history found',
    inReview: 'In Review',
    active: 'Active',
    pending: 'Pending',
    resolved: 'Resolved',
    warning: 'Warning',
  },
  'hi-IN': {
    appName: 'शील्डराइड',
    appTagline: 'डिलीवरी पार्टनर्स के लिए आय सुरक्षा',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हो गया',
    retry: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    continue: 'जारी रखें',
    back: 'पीछे',
    next: 'अगला',
    skip: 'छोड़ें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'मिटाएं',
    close: 'बंद करें',
    week: 'सप्ताह',

    selectLanguage: 'भाषा चुनें',
    selectLanguageDesc: 'ऐप के लिए अपनी पसंदीदा भाषा चुनें',

    login: 'लॉगिन',
    signup: 'साइनअप',
    logout: 'लॉगआउट',
    mobileNumber: 'मोबाइल नंबर',
    enterMobile: '10-अंकों का मोबाइल नंबर दर्ज करें',
    sendOtp: 'OTP भेजें',
    enterOtp: '6-अंकों का OTP दर्ज करें',
    otpSent: 'OTP भेजा गया',
    resendOtp: 'OTP पुनः भेजें',
    verifyOtp: 'OTP सत्यापित करें',
    invalidMobile: 'कृपया एक मान्य 10-अंकों का मोबाइल नंबर दर्ज करें',
    invalidOtp: 'अमान्य OTP। कृपया पुनः प्रयास करें',
    loginSuccess: 'लॉगिन सफल',
    alreadyHaveAccount: 'पहले से ही एक खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    partnerId: 'ब्लिंकिट पार्टनर आईडी',
    enterPartnerId: 'अपनी पार्टनर आईडी दर्ज करें (जैसे, BLK-BLR-047)',
    fullName: 'पूरा नाम',
    enterFullName: 'अपना पूरा नाम दर्ज करें',

    chooseCoverage: 'अपनी सुरक्षा चुनें',
    coverageDesc: 'अपनी दैनिक कमाई के अनुसार एक योजना चुनें',
    basic: 'बेसिक',
    standard: 'स्टैंडर्ड',
    premium: 'प्रीमियम',
    basicDesc: 'बरसाती दिनों के लिए आवश्यक सुरक्षा',
    standardDesc: 'सभी व्यवधान घटनाओं के लिए पूर्ण सुरक्षा',
    premiumDesc: 'उच्चतम कमाई के लिए अधिकतम सुरक्षा',
    perDay: 'प्रति दिन',
    selectPlan: 'योजना चुनें',
    planSelected: 'योजना चुनी गई',
    dailyProtection: 'दैनिक सुरक्षा',
    triggersCovered: 'कवर किए गए ट्रिगर्स',
    autoPayout: 'स्वचालित UPI भुगतान',

    Rainfall: 'बारिश',
    Heat: 'अत्यधिक गर्मी',
    AQI: 'गंभीर AQI',
    Platform: 'प्लेटफार्म डाउनटाइम',
    Internet: 'इंटरनेट आउटेज',
    Fuel: 'ईंधन वृद्धि',
    Incentive: 'प्रोत्साहन गिरावट',
    Wind: 'तेज़ हवा',
    Hail: 'ओलावृष्टि',

    detectLocation: 'स्थान का पता लगाएं',
    locationDesc: 'हमें आपके असाइन किए गए डार्क स्टोर को जोड़ने के लिए आपके स्थान की आवश्यकता है',
    detecting: 'आपके ज़ोन का पता लगाया जा रहा है...',
    locationDetected: 'स्थान का पता चला',
    currentZone: 'वर्तमान ज़ोन',
    darkStore: 'असाइन किया गया डार्क स्टोर',
    zone: 'ज़ोन',
    allowLocation: 'स्थान पहुंच की अनुमति दें',
    locationDenied: 'स्थान पहुंच अस्वीकार कर दी गई। कृपया सेटिंग्स में इसे सक्षम करें।',

    dashboard: 'डैशबोर्ड',
    workerView: 'वर्कर व्यू',
    insurerView: 'बीमाकर्ता व्यू',
    switchToInsurer: 'बीमाकर्ता पर स्विच करें',
    switchToWorker: 'वर्कर पर स्विच करें',
    totalPolicies: 'कुल पॉलिसियाँ',
    totalClaims: 'कुल क्लेम',
    pendingClaims: 'लंबित क्लेम',
    totalEarned: 'कुल सुरक्षित आय',
    fileClaim: 'किसी कार्रवाई की आवश्यकता नहीं',
    settings: 'सेटिंग्स',

    shieldActive: 'शील्ड सक्रिय',
    shieldInactive: 'शील्ड निष्क्रिय',
    shieldPaused: 'शील्ड रुका हुआ',
    yourShield: 'आपका शील्ड',
    activeSince: 'तब से सक्रिय',
    activeSincePetti: 'पेटी के बाद से सक्रिय',
    latestOrderDelivered: 'नवीनतम ऑर्डर डिलीवर किया गया',
    expiresOn: 'समाप्ति तिथि',
    daysRemaining: 'दिन शेष',
    todaysEarnings: 'आज की कमाई',
    coverageAmount: 'कवरेज राशि',
    loginNote: 'नोट: किसी भी 10 अंकों के नंबर और 6 अंकों के ओटीपी का उपयोग करें',

    policyTitle: 'पॉलिसी विवरण',
    policyExplanation: 'आपका पैरामीट्रिक बीमा घटना की गंभीरता के आधार पर भुगतान करता है। किसी क्लेम की आवश्यकता नहीं है।',
    severity: 'गंभीरता',
    payoutAmount: 'भुगतान राशि',
    simulationTitle: 'भुगतान सिम्युलेटर',
    understandPolicy: 'मैं समझता हूँ',

    voiceAssistant: 'वॉयस असिस्टेंट',
    tapToSpeak: 'बोलने के लिए टैप करें',
    listening: 'सुन रहा हूँ...',
    processing: 'प्रक्रिया हो रही है...',
    speaking: 'बोल रहा हूँ...',
    askQuestion: 'अपने कवरेज के बारे में कुछ भी पूछें',
    commonQuestions: 'सामान्य प्रश्न',
    q1Coverage: 'मेरी योजना में क्या कवर है?',
    q2Claim: 'मैं क्लेम कैसे करूँ?',
    q3Payment: 'मुझे भुगतान कब मिलेगा?',
    q4Accident: 'अगर एक्सीडेंट हो जाए तो क्या होगा?',

    lossRatio: 'नुकसान अनुपात',
    reserveForecast: 'रिजर्व पूर्वानुमान',
    fraudDetection: 'धोखाधड़ी का पता लगाना',
    lastUpdated: 'अंतिम अपडेट',
    noTriggers: 'आपके ज़ोन में कोई सक्रिय ट्रिगर नहीं है',
    noClaims: 'कोई क्लेम इतिहास नहीं मिला',
    inReview: 'समीक्षा में',
    active: 'सक्रिय',
    pending: 'लंबित',
    resolved: 'सुलझाया गया',
    warning: 'चेतावनी',
  },
  'kn-IN': {
    appName: 'ಶೀಲ್ಡ್‌ರೈಡ್',
    appTagline: 'ಡೆಲಿವರಿ ಪಾಲುದಾರರಿಗೆ ಆದಾಯ ರಕ್ಷಣೆ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ',
    retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    confirm: 'ಖಚಿತಪಡಿಸಿ',
    continue: 'ಮುಂದುವರಿಸಿ',
    back: 'ಹಿಂದೆ',
    next: 'ಮುಂದೆ',
    skip: 'ಬಿಟ್ಟುಬಿಡಿ',
    save: 'ಉಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    week: 'ವಾರ',

    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
    selectLanguageDesc: 'ಅಪ್ಲಿಕೇಶನ್‌ಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ',

    login: 'ಲಾಗಿನ್',
    signup: 'ಸೈನ್ ಅಪ್',
    logout: 'ಲಾಗ್ ಔಟ್',
    mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    enterMobile: '10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    sendOtp: 'OTP ಕಳುಹಿಸಿ',
    enterOtp: '6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ',
    otpSent: 'OTP ಕಳುಹಿಸಲಾಗಿದೆ',
    resendOtp: 'OTP ಮತ್ತೆ ಕಳುಹಿಸಿ',
    verifyOtp: 'OTP ಪರಿಶೀಲಿಸಿ',
    invalidMobile: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    invalidOtp: 'ಅಮಾನ್ಯ OTP. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    loginSuccess: 'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    dontHaveAccount: 'ಖಾತೆ ಇಲ್ಲವೇ?',
    partnerId: 'ಬ್ಲಿಂಕಿಟ್ ಪಾಲುದಾರ ID',
    enterPartnerId: 'ನಿಮ್ಮ ಪಾಲುದಾರ ID ನಮೂದಿಸಿ (ಉದಾ, BLK-BLR-047)',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    enterFullName: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',

    chooseCoverage: 'ನಿಮ್ಮ ರಕ್ಷಣೆಯನ್ನು ಆರಿಸಿ',
    coverageDesc: 'ನಿಮ್ಮ ದೈನಂದಿನ ಗಳಿಕೆಗೆ ಸರಿಹೊಂದುವ ಯೋಜನೆಯನ್ನು ಆರಿಸಿ',
    basic: 'ಬೇಸಿಕ್',
    standard: 'ಸ್ಟ್ಯಾಂಡರ್ಡ್',
    premium: 'ಪ್ರೀಮಿಯಂ',
    basicDesc: 'ಮಳೆಯ ದಿನಗಳಿಗೆ ಅಗತ್ಯ ರಕ್ಷಣೆ',
    standardDesc: 'ಎಲ್ಲಾ ಅಡಚಣೆ ಘಟನೆಗಳಿಗೆ ಸಂಪೂರ್ಣ ರಕ್ಷಣೆ',
    premiumDesc: 'ಗರಿಷ್ಠ ಗಳಿಕೆಗಾಗಿ ಗರಿಷ್ಠ ರಕ್ಷಣೆ',
    perDay: 'ಪ್ರತಿ ದಿನ',
    selectPlan: 'ಯೋಜನೆಯನ್ನು ಆರಿಸಿ',
    planSelected: 'ಯೋಜನೆಯನ್ನು ಆರಿಸಲಾಗಿದೆ',
    dailyProtection: 'ದೈನಂದಿನ ರಕ್ಷಣೆ',
    triggersCovered: 'ಕವರ್ ಮಾಡಲಾದ ಟ್ರಿಗ್ಗರ್‌ಗಳು',
    autoPayout: 'ಸ್ವಯಂಚಾಲಿತ UPI ಪಾವತಿ',

    Rainfall: 'ಮಳೆ',
    Heat: 'ಅತಿಯಾದ ಶಾಖ',
    AQI: 'ತೀವ್ರ AQI',
    Platform: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಡೌನ್‌ಟೈಮ್',
    Internet: 'ಇಂಟರ್ನೆಟ್ ಸ್ಥಗಿತ',
    Fuel: 'ಇಂಧನ ಬೆಲೆ ಏರಿಕೆ',
    Incentive: 'ಪ್ರೋತ್ಸಾಹಧನ ಕುಸಿತ',
    Wind: 'ಬಲವಾದ ಗಾಳಿ',
    Hail: 'ಆಲಿಕಲ್ಲು ಮಳೆ',

    detectLocation: 'ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಿ',
    locationDesc: 'ನಿಮ್ಮ ನಿಯೋಜಿತ ಡಾರ್ಕ್ ಸ್ಟೋರ್ ಅನ್ನು ಲಿಂಕ್ ಮಾಡಲು ನಮಗೆ ನಿಮ್ಮ ಸ್ಥಳದ ಅಗತ್ಯವಿದೆ',
    detecting: 'ನಿಮ್ಮ ವಲಯವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...',
    locationDetected: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ',
    currentZone: 'ಪ್ರಸ್ತುತ ವಲಯ',
    darkStore: 'ನಿಯೋಜಿತ ಡಾರ್ಕ್ ಸ್ಟೋರ್',
    zone: 'ವಲಯ',
    allowLocation: 'ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ',
    locationDenied: 'ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಅದನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.',

    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    workerView: 'ವರ್ಕರ್ ವ್ಯೂ',
    insurerView: 'ವಿಮಾದಾರ ವ್ಯೂ',
    switchToInsurer: 'ವಿಮಾದಾರರಿಗೆ ಬದಲಿಸಿ',
    switchToWorker: 'ವರ್ಕರ್‌ಗೆ ಬದಲಿಸಿ',
    totalPolicies: 'ಒಟ್ಟು ಪಾಲಿಸಿಗಳು',
    totalClaims: 'ಒಟ್ಟು ಹಕ್ಕುಗಳು',
    pendingClaims: 'ಬಾಕಿ ಇರುವ ಹಕ್ಕುಗಳು',
    totalEarned: 'ಒಟ್ಟು ಸಂರಕ್ಷಿತ ಆದಾಯ',
    fileClaim: 'ಯಾವುದೇ ಕ್ರಮದ ಅಗತ್ಯವಿಲ್ಲ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

    shieldActive: 'ಶೀಲ್ಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
    shieldInactive: 'ಶೀಲ್ಡ್ ನಿಷ್ಕ್ರಿಯವಾಗಿದೆ',
    shieldPaused: 'ಶೀಲ್ಡ್ ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ',
    yourShield: 'ನಿಮ್ಮ ಶೀಲ್ಡ್',
    activeSince: 'ಸಕ್ರಿಯವಾದಾಗಿನಿಂದ',
    activeSincePetti: 'ಪೆಟ್ಟಿಯಿಂದ ಸಕ್ರಿಯವಾಗಿದೆ',
    latestOrderDelivered: 'ಇತ್ತೀಚಿನ ಆರ್ಡರ್ ತಲುಪಿಸಲಾಗಿದೆ',
    expiresOn: 'ಅವಧಿ ಮುಗಿಯುವ ದಿನಾಂಕ',
    daysRemaining: 'ದಿನಗಳು ಬಾಕಿ ಇವೆ',
    todaysEarnings: 'ಇಂದಿನ ಗಳಿಕೆ',
    coverageAmount: 'ಕವರೇಜ್ ಮೊತ್ತ',
    loginNote: 'ಸೂಚನೆ: ಯಾವುದೇ 10 ಅಂಕಿಯ ಸಂಖ್ಯೆ ಮತ್ತು 6 ಅಂಕಿಯ OTP ಬಳಸಿ',

    policyTitle: 'ಪಾಲಿಸಿ ವಿವರಣೆ',
    policyExplanation: 'ನಿಮ್ಮ ಪ್ಯಾರಾಮೆಟ್ರಿಕ್ ವಿಮೆಯು ಘಟನೆಯ ತೀವ್ರತೆಯ ಆಧಾರದ ಮೇಲೆ ಪಾವತಿಸುತ್ತದೆ. ಯಾವುದೇ ಕ್ಲೈಮ್‌ಗಳ ಅಗತ್ಯವಿಲ್ಲ.',
    severity: 'ತೀವ್ರತೆ',
    payoutAmount: 'ಪಾವತಿ ಮೊತ್ತ',
    simulationTitle: 'ಪಾವತಿ ಸಿಮ್ಯುಲೇಟರ್',
    understandPolicy: 'ನನಗೆ ಅರ್ಥವಾಗಿದೆ',

    voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ',
    tapToSpeak: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    listening: 'ಕೇಳುತ್ತಿದೆ...',
    processing: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
    speaking: 'ಮಾತನಾಡುತ್ತಿದೆ...',
    askQuestion: 'ನಿಮ್ಮ ಕವರೇಜ್ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ',
    commonQuestions: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು',
    q1Coverage: 'ನನ್ನ ಯೋಜನೆ ಏನನ್ನು ಕವರ್ ಮಾಡುತ್ತದೆ?',
    q2Claim: 'ನಾನು ಹಕ್ಕು ಹೇಗೆ ಸಲ್ಲಿಸುವುದು?',
    q3Payment: 'ನನಗೆ ಪಾವತಿ ಯಾವಾಗ ಸಿಗುತ್ತದೆ?',
    q4Accident: 'ನನಗೆ ಅಪಘಾತವಾದರೆ ಏನಾಗುತ್ತದೆ?',

    lossRatio: 'ನಷ್ಟ ಅನುಪಾತ',
    reserveForecast: 'ಮೀಸಲು ಮುನ್ಸೂಚನೆ',
    fraudDetection: 'ವಂಚನೆ ಪತ್ತೆ',
    lastUpdated: 'ಕೊನೆಯ ಅಪ್‌ಡೇಟ್',
    noTriggers: 'ನಿಮ್ಮ ವಲಯದಲ್ಲಿ ಯಾವುದೇ ಸಕ್ರಿಯ ಟ್ರಿಗ್ಗರ್‌ಗಳಿಲ್ಲ',
    noClaims: 'ಯಾವುದೇ ಹಕ್ಕುಗಳ ಇತಿಹಾಸ ಕಂಡುಬಂದಿಲ್ಲ',
    inReview: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    active: 'ಸಕ್ರಿಯ',
    pending: 'ಬಾಕಿ ಇದೆ',
    resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    warning: 'ಎಚ್ಚರಿಕೆ',
  },
};

const STORAGE_KEY = 'shieldride_language';

export function getSavedLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en-IN';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'en-IN' || saved === 'hi-IN' || saved === 'kn-IN')) {
      return saved as LanguageCode;
    }
  } catch {
    // Ignore storage errors
  }
  return 'en-IN';
}

export function saveLanguage(language: LanguageCode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore storage errors
  }
}

export function getTranslations(language: LanguageCode): I18nStrings {
  return TRANSLATIONS[language] || TRANSLATIONS['en-IN'];
}

// Helper to get all languages
export const getAllLanguages = () => LANGUAGE_CONFIGS;

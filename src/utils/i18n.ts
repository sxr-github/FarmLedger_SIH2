import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      'welcome': 'Welcome',
      'dashboard': 'Dashboard',
      'products': 'Products',
      'logout': 'Logout',
      'login': 'Login',
      'register': 'Register',
      'save': 'Save',
      'cancel': 'Cancel',
      'submit': 'Submit',
      'loading': 'Loading...',
      'success': 'Success',
      'error': 'Error',
      'warning': 'Warning',
      
      // Navigation
      'my_produce': 'My Produce',
      'register_product': 'Register Product',
      'transaction_registry': 'Transaction Registry',
      'msp_status': 'MSP Status',
      'qr_codes': 'QR Codes',
      'smart_contracts': 'Smart Contracts',
      'active_transactions': 'Active Transactions',
      'order_status': 'Order Status',
      'batch_verification': 'Batch Verification',
      'logistics': 'Logistics',
      'sales_tracking': 'Sales Tracking',
      'verification': 'Verification',
      'certificates': 'Certificates',
      'farmer_details': 'Farmer Details',
      'kyc_verification': 'KYC Verification',
      'payment_gateway': 'Payment Gateway',
      'chatbot': 'Chatbot',
      
      // Product related
      'product_name': 'Product Name',
      'batch_id': 'Batch ID',
      'quantity': 'Quantity',
      'price': 'Price',
      'harvest_date': 'Harvest Date',
      'expiry_date': 'Expiry Date',
      'location': 'Location',
      'status': 'Status',
      
      // Roles
      'farmer': 'Farmer',
      'distributor': 'Distributor',
      'retailer': 'Retailer',
      'consumer': 'Consumer',
      'admin': 'Admin',
      'validator': 'Validator',
      
      // Messages
      'product_registered_success': 'Product registered successfully!',
      'qr_generated_success': 'QR Code generated successfully!',
      'payment_success': 'Payment completed successfully!',
      'kyc_submitted': 'KYC documents submitted for verification',
      'scan_qr_instruction': 'Point your camera at the QR code to scan',
    }
  },
  hi: {
    translation: {
      // Common
      'welcome': 'स्वागत',
      'dashboard': 'डैशबोर्ड',
      'products': 'उत्पाद',
      'logout': 'लॉग आउट',
      'login': 'लॉग इन',
      'register': 'पंजीकरण',
      'save': 'सेव करें',
      'cancel': 'रद्द करें',
      'submit': 'जमा करें',
      'loading': 'लोड हो रहा है...',
      'success': 'सफलता',
      'error': 'त्रुटि',
      'warning': 'चेतावनी',
      
      // Navigation
      'my_produce': 'मेरा उत्पादन',
      'register_product': 'उत्पाद पंजीकरण',
      'transaction_registry': 'लेनदेन रजिस्ट्री',
      'msp_status': 'MSP स्थिति',
      'qr_codes': 'QR कोड',
      'smart_contracts': 'स्मार्ट कॉन्ट्रैक्ट',
      'active_transactions': 'सक्रिय लेनदेन',
      'order_status': 'ऑर्डर स्थिति',
      'batch_verification': 'बैच सत्यापन',
      'logistics': 'रसद',
      'sales_tracking': 'बिक्री ट्रैकिंग',
      'verification': 'सत्यापन',
      'certificates': 'प्रमाणपत्र',
      'farmer_details': 'किसान विवरण',
      'kyc_verification': 'KYC सत्यापन',
      'payment_gateway': 'पेमेंट गेटवे',
      'chatbot': 'चैटबॉट',
      
      // Product related
      'product_name': 'उत्पाद का नाम',
      'batch_id': 'बैच ID',
      'quantity': 'मात्रा',
      'price': 'मूल्य',
      'harvest_date': 'फसल की तारीख',
      'expiry_date': 'समाप्ति तिथि',
      'location': 'स्थान',
      'status': 'स्थिति',
      
      // Roles
      'farmer': 'किसान',
      'distributor': 'वितरक',
      'retailer': 'खुदरा विक्रेता',
      'consumer': 'उपभोक्ता',
      'admin': 'प्रशासक',
      'validator': 'सत्यापनकर्ता',
      
      // Messages
      'product_registered_success': 'उत्पाद सफलतापूर्वक पंजीकृत!',
      'qr_generated_success': 'QR कोड सफलतापूर्वक जेनरेट किया गया!',
      'payment_success': 'भुगतान सफलतापूर्वक पूरा हुआ!',
      'kyc_submitted': 'KYC दस्तावेज सत्यापन के लिए जमा किए गए',
      'scan_qr_instruction': 'स्कैन करने के लिए अपना कैमरा QR कोड पर पॉइंट करें',
    }
  },
  or: {
    translation: {
      // Common
      'welcome': 'ସ୍ୱାଗତ',
      'dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
      'products': 'ଉତ୍ପାଦ',
      'logout': 'ଲଗ ଆଉଟ',
      'login': 'ଲଗ ଇନ',
      'register': 'ପଞ୍ଜୀକରଣ',
      'save': 'ସେଭ କରନ୍ତୁ',
      'cancel': 'ବାତିଲ କରନ୍ତୁ',
      'submit': 'ଦାଖଲ କରନ୍ତୁ',
      'loading': 'ଲୋଡ ହେଉଛି...',
      'success': 'ସଫଳତା',
      'error': 'ତ୍ରୁଟି',
      'warning': 'ଚେତାବନୀ',
      
      // Navigation
      'my_produce': 'ମୋର ଉତ୍ପାଦନ',
      'register_product': 'ଉତ୍ପାଦ ପଞ୍ଜୀକରଣ',
      'transaction_registry': 'କାରବାର ରେଜିଷ୍ଟ୍ରି',
      'msp_status': 'MSP ସ୍ଥିତି',
      'qr_codes': 'QR କୋଡ',
      'smart_contracts': 'ସ୍ମାର୍ଟ କଣ୍ଟ୍ରାକ୍ଟ',
      'active_transactions': 'ସକ୍ରିୟ କାରବାର',
      'order_status': 'ଅର୍ଡର ସ୍ଥିତି',
      'batch_verification': 'ବ୍ୟାଚ ଯାଞ୍ଚ',
      'logistics': 'ଲଜିଷ୍ଟିକ୍ସ',
      'sales_tracking': 'ବିକ୍ରୟ ଟ୍ରାକିଂ',
      'verification': 'ଯାଞ୍ଚ',
      'certificates': 'ପ୍ରମାଣପତ୍ର',
      'farmer_details': 'କୃଷକ ବିବରଣୀ',
      'kyc_verification': 'KYC ଯାଞ୍ଚ',
      'payment_gateway': 'ପେମେଣ୍ଟ ଗେଟୱେ',
      'chatbot': 'ଚାଟବଟ',
      
      // Product related
      'product_name': 'ଉତ୍ପାଦର ନାମ',
      'batch_id': 'ବ୍ୟାଚ ID',
      'quantity': 'ପରିମାଣ',
      'price': 'ମୂଲ୍ୟ',
      'harvest_date': 'ଅମଳ ତାରିଖ',
      'expiry_date': 'ସମାପ୍ତି ତାରିଖ',
      'location': 'ସ୍ଥାନ',
      'status': 'ସ୍ଥିତି',
      
      // Roles
      'farmer': 'କୃଷକ',
      'distributor': 'ବିତରକ',
      'retailer': 'ଖୁଚୁରା ବିକ୍ରେତା',
      'consumer': 'ଗ୍ରାହକ',
      'admin': 'ପ୍ରଶାସକ',
      'validator': 'ଯାଞ୍ଚକାରୀ',
      
      // Messages
      'product_registered_success': 'ଉତ୍ପାଦ ସଫଳତାର ସହିତ ପଞ୍ଜୀକୃତ!',
      'qr_generated_success': 'QR କୋଡ ସଫଳତାର ସହିତ ତିଆରି!',
      'payment_success': 'ପେମେଣ୍ଟ ସଫଳତାର ସହିତ ସମ୍ପୂର୍ଣ୍ଣ!',
      'kyc_submitted': 'KYC ଦଲିଲ ଯାଞ୍ଚ ପାଇଁ ଦାଖଲ',
      'scan_qr_instruction': 'ସ୍କାନ କରିବା ପାଇଁ ଆପଣଙ୍କ କ୍ୟାମେରାକୁ QR କୋଡରେ ପଏଣ୍ଟ କରନ୍ତୁ',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
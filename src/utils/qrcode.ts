import QRCode from 'qrcode';
import { QRCodePayload } from '../types';

const SECRET_KEY = 'agricchain-secret-key-2024'; // In production, use environment variable

export const generateQRCodePayload = (productId: string): QRCodePayload => {
  const timestamp = Date.now();
  const message = `${productId}:${timestamp}`;
  
  // In production, use proper HMAC-SHA256 or JWT signing
  const signature = btoa(message + SECRET_KEY).replace(/[^a-zA-Z0-9]/g, '');
  
  return {
    productId,
    timestamp,
    signature,
  };
};

export const validateQRCodePayload = (payload: QRCodePayload): boolean => {
  const { productId, timestamp, signature } = payload;
  const message = `${productId}:${timestamp}`;
  const expectedSignature = btoa(message + SECRET_KEY).replace(/[^a-zA-Z0-9]/g, '');
  
  // Check signature validity
  if (signature !== expectedSignature) {
    return false;
  }
  
  // Check timestamp (valid for 24 hours)
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (now - timestamp) < maxAge;
};

export const generateQRCode = async (productId: string): Promise<string> => {
  const payload = generateQRCodePayload(productId);
  const qrData = JSON.stringify(payload);
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const parseQRCode = (qrData: string): QRCodePayload | null => {
  try {
    const payload = JSON.parse(qrData) as QRCodePayload;
    
    if (validateQRCodePayload(payload)) {
      return payload;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};
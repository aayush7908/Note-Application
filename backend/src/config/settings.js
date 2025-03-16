// Environment variables
export const FRONTEND_DOMAIN_URL = process.env.FRONTEND_DOMAIN_URL
export const MONGO_URI = process.env.MONGO_URI
export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
export const GMAIL_SENDER = process.env.GMAIL_SENDER
export const GMAIL_RECEIVER = process.env.GMAIL_RECEIVER

// API constants
export const DEFAULT_NOTE_TAG = 'general';
export const MAX_PAGE_SIZE = 15;

// Token constants
export const AUTH_TOKEN_VALID_DURATION = 1000 * 60 * 60 * 24 * 7;   // 1 week
export const PASSWORD_RESET_TOKEN_VALID_DURATION = 1000 * 60 * 10;  // 10 mins

// OTP constants
export const OTP_VALID_DURATION = 1000 * 60 * 10;  // 10 mins
export const OTP_LETTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
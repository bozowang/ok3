/// <reference types="vite/client" />

export const SHIPPING_FEE = 30;

// IMPORTANT: Remember to set your Google Apps Script URL in Vercel environment variables
// as VITE_GOOGLE_SHEETS_SCRIPT_URL
export const GOOGLE_SHEETS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_SCRIPT_URL || '';

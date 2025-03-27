export const fapshiConfig = {
  // Base URLs
  baseUrl: {
    sandbox: 'https://sandbox.fapshi.com',
    production: 'https://live.fapshi.com',
  },

  // API credentials
  apiKey: process.env.FAPSHI_API_KEY || '',
  apiUser: process.env.FAPSHI_API_USER || '',

  // Environment
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',

  // Webhook URL (to be configured in your application)
  webhookUrl: process.env.FAPSHI_WEBHOOK_URL || '',
};

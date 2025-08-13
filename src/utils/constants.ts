export const APP_NAME = process.env.REACT_APP_APP_NAME || 'ZY-YD AI Tools';
export const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';

export const CHAT_CONFIG = {
  maxMessageLength: 1000,
  defaultPlaceholder: '输入您的问题...',
  defaultHeight: '600px',
} as const;
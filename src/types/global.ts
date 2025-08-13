export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatConfig {
  apiUrl?: string;
  apiKey?: string;
  model?: string;
}
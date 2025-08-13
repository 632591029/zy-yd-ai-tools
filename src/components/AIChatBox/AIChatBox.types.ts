import { Message } from '../../types/global';

export interface AIChatBoxProps {
  onSendMessage?: (message: string, model?: string) => Promise<string>;
  placeholder?: string;
  height?: string;
  className?: string;
  initialMessages?: Message[];
  showTimestamp?: boolean;
  allowMarkdown?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
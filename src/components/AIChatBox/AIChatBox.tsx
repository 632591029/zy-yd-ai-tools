import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, AlertCircle, Trash2, Settings } from 'lucide-react';
import { AIChatBoxProps, ChatState } from './AIChatBox.types';
import { Message } from '../../types/global';
import ModelSelector from './ModelSelector';

const AIChatBox: React.FC<AIChatBoxProps> = ({
  onSendMessage,
  placeholder = "输入您的问题...",
  height = "600px",
  className = "",
  initialMessages = [],
  showTimestamp = true,
  maxLength = 1000,
  disabled = false
}) => {
  const [state, setState] = useState<ChatState>({
    messages: initialMessages.length > 0 ? initialMessages : [
      {
        id: '1',
        content: '你好！我是AI助手，有什么可以帮助您的吗？',
        sender: 'ai',
        timestamp: new Date()
      }
    ],
    isLoading: false,
    error: null
  });
  
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  // 模拟AI回复
  const mockAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const responses = [
      `我收到了您的消息："${userMessage}"。这是一个很好的问题！`,
      '让我思考一下这个问题...',
      '根据您的问题，我建议您可以尝试以下几个方向...',
      '这是一个有趣的话题，我们可以进一步讨论。',
      '感谢您的提问，希望我的回答对您有帮助。如果您还有其他问题，随时可以询问我。',
      '基于我的理解，这个问题涉及到几个关键点...'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || state.isLoading || disabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    
    setInputValue('');

    try {
      const aiResponseText = onSendMessage 
        ? await onSendMessage(userMessage.content, selectedModel)
        : await mockAIResponse(userMessage.content);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，发生了错误，请稍后重试。',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: error instanceof Error ? error.message : '未知错误'
      }));
    }
  };

  // 清空聊天记录
  const handleClearChat = () => {
    setState({
      messages: [
        {
          id: '1',
          content: '聊天记录已清空。有什么可以帮助您的吗？',
          sender: 'ai',
          timestamp: new Date()
        }
      ],
      isLoading: false,
      error: null
    });
  };

  // 按Enter发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 输入长度检查
  const isInputTooLong = inputValue.length > maxLength;

  return (
    <div 
      className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}
      style={{ height }}
    >
      {/* 聊天头部 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AI助手</h3>
            <p className="text-xs text-blue-100">使用 {selectedModel}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">在线</span>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="设置"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleClearChat}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="清空聊天记录"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 模型选择器 */}
      {showSettings && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择AI模型
              </label>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                disabled={state.isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {state.error && (
        <div className="mx-4 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{state.error}</span>
        </div>
      )}

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((message) => (
          <div
            key={message.id}
            className={`flex animate-fade-in ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start max-w-[75%] ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* 头像 */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white ml-2' 
                    : 'bg-gray-100 text-gray-600 mr-2'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* 消息气泡 */}
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-50 text-gray-900 rounded-bl-sm'
                } shadow-sm`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {showTimestamp && (
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 加载状态 */}
        {state.isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 mr-2 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg rounded-bl-sm shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div 
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                    style={{animationDelay: '0.1s'}}
                  ></div>
                  <div 
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                    style={{animationDelay: '0.2s'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={disabled ? "聊天已禁用" : placeholder}
              disabled={state.isLoading || disabled}
              maxLength={maxLength}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
                isInputTooLong 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300'
              }`}
            />
            
            {/* 字符计数 */}
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${
                isInputTooLong ? 'text-red-500' : 'text-gray-500'
              }`}>
                {inputValue.length}/{maxLength}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || state.isLoading || disabled || isInputTooLong}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center min-w-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
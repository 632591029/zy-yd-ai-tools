import React from 'react';
import { AIChatBox } from './components';
import { sendChatMessage } from './utils/api';
import { APP_NAME } from './utils/constants';
import './App.css';

const App: React.FC = () => {
  // 自定义消息处理函数
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      return await sendChatMessage(message);
    } catch (error) {
      console.error('Message send failed:', error);
      // 降级到模拟回复
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `我收到了您的消息："${message}"。由于API暂时不可用，这是一个模拟回复。`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {APP_NAME}
          </h1>
          <p className="text-gray-600">
            智能AI聊天工具，为您提供便捷的对话体验
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                主聊天界面
              </h2>
              <AIChatBox 
                height="600px"
                onSendMessage={handleSendMessage}
                placeholder="输入您的问题，开始AI对话..."
                showTimestamp={true}
                maxLength={1000}
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                简洁版本
              </h2>
              <AIChatBox 
                height="600px"
                placeholder="简洁版AI助手..."
                showTimestamp={false}
                className="shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
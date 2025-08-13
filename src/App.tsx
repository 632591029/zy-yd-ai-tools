import React from 'react';
import { AIChatBox } from './components';
import { sendChatMessage } from './utils/api';
import { APP_NAME } from './utils/constants';
import './App.css';

const App: React.FC = () => {
  // 自定义消息处理函数
  const handleSendMessage = async (message: string, model: string = 'gpt-3.5-turbo'): Promise<string> => {
    try {
      return await sendChatMessage(message, model);
    } catch (error) {
      console.error('Message send failed:', error);
      // 降级到模拟回复
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `我收到了您的消息："${message}"。由于API暂时不可用，这是一个模拟回复。请配置正确的API地址。`;
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
            智能AI聊天工具，支持多种AI模型，为您提供便捷的对话体验
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>支持 OpenAI GPT</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>支持 DeepSeek</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>GraphQL API</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center space-x-2">
                <span>🤖</span>
                <span>智能聊天</span>
              </h2>
              <AIChatBox 
                height="650px"
                onSendMessage={handleSendMessage}
                placeholder="输入您的问题，开始AI对话..."
                showTimestamp={true}
                maxLength={2000}
              />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center space-x-2">
                <span>⚡</span>
                <span>快速体验</span>
              </h2>
              <AIChatBox 
                height="650px"
                placeholder="快速AI助手（使用默认模型）..."
                showTimestamp={false}
                maxLength={1000}
                className="shadow-xl"
              />
            </div>
          </div>
          
          {/* API 配置提示 */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <span>⚙️</span>
              <span>API 配置说明</span>
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>要使用真实的AI功能，请部署后端API并配置以下环境变量：</p>
              <div className="bg-gray-50 p-3 rounded border">
                <code className="text-xs">
                  REACT_APP_GRAPHQL_URL=https://your-worker.your-subdomain.workers.dev/graphql
                </code>
              </div>
              <p>后端API项目：<a href="https://github.com/632591029/zy-yd-ai-api" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">zy-yd-ai-api</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
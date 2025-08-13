import React from 'react';
import { AIChatBox } from './components';
import { sendChatMessage } from './utils/api';
import { APP_NAME } from './utils/constants';
import './App.css';

const App: React.FC = () => {
  // 自定义消息处理函数
  const handleSendMessage = async (message: string, model: string = 'gpt-3.5-turbo'): Promise<string> => {
    try {
      console.log('🚀 发送消息到Workers API:', {
        message: message.substring(0, 50) + '...',
        model,
        timestamp: new Date().toISOString()
      });
      
      const response = await sendChatMessage(message, model);
      
      console.log('✅ 收到Workers API响应');
      return response;
    } catch (error) {
      console.error('❌ Workers API调用失败:', error);
      
      // 降级到模拟回复
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `抱歉，当前AI服务暂时不可用。请稍后重试。\n\n错误信息：${error instanceof Error ? error.message : '未知错误'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {APP_NAME}
          </h1>
          <p className="text-gray-600 mb-4">
            智能AI聊天助手，支持多种AI模型
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>OpenAI GPT</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>DeepSeek</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>实时在线</span>
            </div>
          </div>
        </div>
        
        {/* 聊天界面 */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center justify-center space-x-2 mb-4">
              <span>🤖</span>
              <span>AI智能助手</span>
            </h2>
            
            {/* 使用说明 - 简化版 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium mb-2 text-center">💡 使用说明：</p>
              <div className="text-blue-700 text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">1</span>
                  <span>点击右上角 ⚙️ 设置按钮选择AI模型</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">2</span>
                  <span>输入您的问题开始对话</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">3</span>
                  <span>支持GPT-3.5、GPT-4、DeepSeek等多种模型</span>
                </div>
              </div>
            </div>
          </div>
          
          <AIChatBox 
            height="650px"
            onSendMessage={handleSendMessage}
            placeholder="输入您的问题，开始AI对话..."
            showTimestamp={true}
            maxLength={2000}
            className="shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
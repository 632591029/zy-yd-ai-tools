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
        message,
        model,
        apiUrl: 'https://zy-yd-ai-api.a632591029.workers.dev/graphql',
        timestamp: new Date().toISOString()
      });
      
      const response = await sendChatMessage(message, model);
      
      console.log('✅ 收到Workers API响应:', {
        response: response.substring(0, 100) + '...',
        model,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      console.error('❌ Workers API调用失败:', error);
      
      // 降级到模拟回复，明确标识
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `🤖 [本地模拟回复 - API未连接]\n\n您的消息："${message}"\n\n⚠️ 当前使用模拟模式，原因：${error instanceof Error ? error.message : '未知错误'}\n\n请检查：\n• Workers API是否正常运行\n• API密钥是否已配置\n• 网络连接是否正常`;
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
            智能AI聊天工具，支持OpenAI和DeepSeek多种模型
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
              <span>Cloudflare Workers</span>
            </div>
          </div>
        </div>
        
        {/* 只保留一个聊天框 */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center justify-center space-x-2 mb-4">
              <span>🤖</span>
              <span>AI智能助手</span>
            </h2>
            
            {/* 使用说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium mb-2 text-center">💡 如何切换AI模型：</p>
              <div className="text-blue-700 text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">步骤1</span>
                  <span>点击聊天框右上角的 <span className="bg-blue-100 px-2 py-1 rounded">⚙️ 设置</span> 按钮</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">步骤2</span>
                  <span>在弹出的模型选择器中选择AI模型（GPT-3.5、GPT-4、DeepSeek Chat、DeepSeek Coder）</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">步骤3</span>
                  <span>输入问题开始对话，聊天框标题会显示当前使用的模型</span>
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
          
          {/* 验证Workers API的方法 */}
          <div className="mt-8 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>🔍</span>
                <span>如何验证是否使用了您的Workers API</span>
              </h3>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">1</span>
                    <span>浏览器控制台</span>
                  </h4>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 按 <kbd className="bg-gray-100 px-2 py-1 rounded">F12</kbd> 打开开发者工具</li>
                    <li>• 切换到 <strong>Console</strong> 标签</li>
                    <li>• 发送消息查看日志：</li>
                    <li>• 🚀 表示发送请求</li>
                    <li>• ✅ 表示收到响应</li>
                    <li>• ❌ 表示API失败</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">2</span>
                    <span>网络请求面板</span>
                  </h4>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 切换到 <strong>Network</strong> 标签</li>
                    <li>• 发送消息后查找 <code className="bg-gray-100 px-1 rounded">graphql</code> 请求</li>
                    <li>• 检查请求URL是否为您的Workers地址</li>
                    <li>• 状态码200表示成功</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">3</span>
                    <span>回复内容识别</span>
                  </h4>
                  <ul className="text-gray-600 space-y-2 text-sm">
                    <li>• 如果回复前缀是 <code className="bg-red-100 text-red-600 px-1 rounded">[本地模拟回复]</code> 说明API未连接</li>
                    <li>• 正常的AI回复没有这个前缀</li>
                    <li>• OpenAI和DeepSeek回复风格不同</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">🌐 直接测试Workers API：</h4>
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://zy-yd-ai-api.a632591029.workers.dev/graphql" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    🚀 打开 GraphQL Playground
                  </a>
                  <span className="text-sm text-gray-600">应该能看到GraphQL查询界面</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
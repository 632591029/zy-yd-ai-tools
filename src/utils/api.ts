export const API_CONFIG = {
  // 使用实际的 Workers URL
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL || 'https://zy-yd-ai-api.a632591029.workers.dev/graphql',
  // 模拟模式开关
  mockMode: process.env.REACT_APP_MOCK_MODE === 'true'
};

// GraphQL 查询
export const CHAT_MUTATION = `
  mutation SendMessage($input: ChatInput!) {
    sendMessage(input: $input) {
      success
      reply
      error
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
    }
  }
`;

export const MODELS_QUERY = `
  query GetModels {
    models {
      id
      name
      provider
      description
    }
  }
`;

// AI 模型类型
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

// 聊天响应类型
export interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// 模拟AI回复
function generateMockResponse(message: string, model: string): string {
  const responses = {
    'gpt-3.5-turbo': [
      `作为GPT-3.5，我理解您的问题："${message}"。这是一个很有趣的话题，让我为您详细分析一下...`,
      `根据您的提问，我认为这个问题涉及几个关键要点。首先...`,
      `这是一个很好的问题！基于我的理解，我建议从以下几个角度来考虑...`
    ],
    'gpt-4': [
      `作为GPT-4，我可以为您提供更深入的分析。您提到的"${message}"确实值得深入探讨...`,
      `从GPT-4的角度来看，这个问题具有多层次的复杂性。让我为您逐一分析...`,
      `您的问题很有深度。作为更先进的AI模型，我认为应该从系统性的角度来回答...`
    ],
    'deepseek-chat': [
      `作为DeepSeek对话模型，我注意到您的问题："${message}"。从技术角度来看...`,
      `DeepSeek在这类问题上有独特的见解。让我为您提供一个详细的回答...`,
      `根据DeepSeek的训练数据和算法，我认为这个问题可以这样理解...`
    ],
    'deepseek-coder': [
      `作为DeepSeek编程专家，我看到您的问题与技术相关。让我为您提供一个技术性的回答...`,
      `从编程的角度来看，"${message}"这个问题可以通过以下方式解决...`,
      `作为专注于代码的AI助手，我建议采用以下技术方案...`
    ]
  };

  const modelResponses = responses[model as keyof typeof responses] || responses['gpt-3.5-turbo'];
  const randomResponse = modelResponses[Math.floor(Math.random() * modelResponses.length)];
  
  return `${randomResponse}\n\n📝 注意：这是模拟回复，用于演示不同AI模型的响应风格。实际使用时会调用真实的API。`;
}

// GraphQL 请求函数
export async function graphqlRequest(query: string, variables?: any): Promise<any> {
  // 如果是模拟模式
  if (API_CONFIG.mockMode) {
    console.log('🎭 使用模拟模式');
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    if (query.includes('models')) {
      return {
        models: [
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', description: 'OpenAI的快速响应模型 (模拟)' },
          { id: 'gpt-4', name: 'GPT-4', provider: 'openai', description: 'OpenAI的最强模型 (模拟)' },
          { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'deepseek', description: 'DeepSeek的对话模型 (模拟)' },
          { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'deepseek', description: 'DeepSeek的代码生成模型 (模拟)' }
        ]
      };
    }
    
    if (query.includes('sendMessage') && variables?.input) {
      const { message, model } = variables.input;
      return {
        sendMessage: {
          success: true,
          reply: generateMockResponse(message, model),
          error: null,
          usage: {
            promptTokens: message.length / 4,
            completionTokens: 150,
            totalTokens: message.length / 4 + 150
          }
        }
      };
    }
  }

  // 正常API调用
  try {
    const response = await fetch(API_CONFIG.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    return data.data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
}

// 发送聊天消息
export async function sendChatMessage(
  message: string, 
  model: string = 'gpt-3.5-turbo',
  temperature: number = 0.7,
  maxTokens: number = 1000
): Promise<string> {
  try {
    const data = await graphqlRequest(CHAT_MUTATION, {
      input: {
        message,
        model,
        temperature,
        maxTokens,
      },
    });

    const result: ChatResponse = data.sendMessage;
    
    if (!result.success) {
      throw new Error(result.error || '未知错误');
    }

    return result.reply || '抱歉，没有收到有效回复。';
  } catch (error) {
    console.error('Send message failed:', error);
    throw new Error(error instanceof Error ? error.message : '网络请求失败，请检查网络连接。');
  }
}

// 获取可用模型
export async function getAvailableModels(): Promise<AIModel[]> {
  try {
    const data = await graphqlRequest(MODELS_QUERY);
    return data.models;
  } catch (error) {
    console.error('Get models failed:', error);
    // 返回默认模型列表
    return [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        description: 'OpenAI的快速响应模型'
      }
    ];
  }
}
export const API_CONFIG = {
  // 使用实际的 Workers URL
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL || 'https://zy-yd-ai-api.a632591029.workers.dev/graphql',
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

// GraphQL 请求函数
export async function graphqlRequest(query: string, variables?: any): Promise<any> {
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
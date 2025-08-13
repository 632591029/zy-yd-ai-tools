export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_BASE_URL || '',
  apiKey: process.env.REACT_APP_API_KEY || '',
};

export async function sendChatMessage(message: string): Promise<string> {
  if (!API_CONFIG.baseUrl) {
    throw new Error('API URL not configured');
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || data.message || '抱歉，没有收到有效回复。';
  } catch (error) {
    console.error('API call failed:', error);
    throw new Error('网络请求失败，请检查网络连接。');
  }
}
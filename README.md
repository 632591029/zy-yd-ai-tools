# ZY-YD AI Tools

一个基于 React + TypeScript 的 AI 聊天工具集合。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.0-blue.svg)

## ✨ 功能特性

- 🤖 **智能AI聊天界面** - 现代化的聊天界面设计
- 💬 **实时消息交互** - 支持实时消息发送和接收
- 🎨 **美观的UI设计** - 基于Tailwind CSS的现代化界面
- 📱 **响应式布局** - 完美适配各种设备尺寸
- ⚡ **TypeScript支持** - 完整的类型安全保障
- 🎯 **高度可定制** - 丰富的配置选项
- 🔧 **易于集成** - 简单的API接口设计
- 📝 **消息记录** - 支持聊天历史记录
- 🚀 **性能优化** - 优化的渲染性能

## 🛠 技术栈

- **前端框架**: React 18
- **类型系统**: TypeScript
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **构建工具**: Create React App
- **代码质量**: ESLint + Prettier

## 🚀 快速开始

### 前置要求

- Node.js >= 16.0.0
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/632591029/zy-yd-ai-tools.git
cd zy-yd-ai-tools
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

4. **启动开发服务器**
```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 打开。

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   └── AIChatBox/      # AI聊天框组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── types/              # 全局类型定义
├── styles/             # 样式文件
├── App.tsx             # 主应用组件
└── index.tsx           # 应用入口
```

## 🔧 组件使用

### AIChatBox 基础用法

```tsx
import { AIChatBox } from '@/components';

function App() {
  return (
    <AIChatBox 
      height="600px"
      placeholder="输入您的问题..."
    />
  );
}
```

### 自定义API处理

```tsx
const handleSendMessage = async (message: string): Promise<string> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  return data.reply;
};

return (
  <AIChatBox 
    onSendMessage={handleSendMessage}
    showTimestamp={true}
    maxLength={1000}
  />
);
```

## 🧪 开发命令

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 格式化代码
npm run format
```

## 📝 许可证

本项目采用 MIT 许可证。

---

如果这个项目对您有帮助，请给它一个 ⭐️！
# 南京医科大学场馆预约系统

本文档提供了南京医科大学场馆预约系统的完整说明，包括系统架构、功能模块、API接口、使用方法和开发指南。

## 文档目录

- [系统概述](backend/docs/overview.md)
- [安装与部署](backend/docs/installation.md)
- [系统架构](backend/docs/architecture.md)
- [模块说明](backend/docs/modules.md)
- [API参考](backend/docs/api.md)
- [使用指南](backend/docs/usage.md)
- [常见问题](backend/docs/faq.md)

## 快速开始

### 安装依赖

#### 后端

```bash
cd backend
.venv/Scripts/activate
pip install -r requirements.txt
```

#### 前端

```bash
cd frontend
npm install
```

### 启动API服务器

#### 后端

```bash
uvicorn main:app --reload
```

#### 前端

```bash
npm run dev
```

## 联系方式

如有问题或建议，请联系Anorak2004@outlook.com 
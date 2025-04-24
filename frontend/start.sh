#!/bin/bash

# 设置环境变量使Next.js在0.0.0.0上监听
export HOST=0.0.0.0
export PORT=3000

# 启动Next.js应用
echo "在 $HOST:$PORT 上启动Next.js应用..."
npm run start:prod 
#!/bin/bash

# 拉取最新代码（如果使用Git）
# git pull

# 安装可能的新依赖
echo "安装依赖..."
npm install

# 构建Next.js应用
echo "重新构建Next.js应用..."
npm run build

# 部署目录
DEPLOY_DIR="/var/www/html"
echo "更新部署目录: $DEPLOY_DIR"

# 停止正在运行的Next.js应用
echo "停止当前运行的应用..."
# 查找并终止当前运行的Next.js进程
NEXT_PID=$(ps aux | grep "next start" | grep -v grep | awk '{print $2}')
if [ ! -z "$NEXT_PID" ]; then
  echo "终止Next.js进程 (PID: $NEXT_PID)..."
  sudo kill $NEXT_PID
else
  echo "未找到运行中的Next.js进程"
fi

# 复制更新后的文件到部署目录
echo "复制更新后的文件..."
sudo cp -R .next $DEPLOY_DIR/
sudo cp -R public $DEPLOY_DIR/
# 只在package.json有变化时复制node_modules和package.json
if [ -f "package.json.md5" ]; then
  OLD_MD5=$(cat package.json.md5)
  NEW_MD5=$(md5sum package.json | awk '{print $1}')
  if [ "$OLD_MD5" != "$NEW_MD5" ]; then
    echo "package.json已变更，更新依赖..."
    sudo cp -R node_modules $DEPLOY_DIR/
    sudo cp package.json $DEPLOY_DIR/
    md5sum package.json | awk '{print $1}' > package.json.md5
  else
    echo "package.json未变更，跳过依赖更新"
  fi
else
  echo "初次记录package.json校验和..."
  sudo cp -R node_modules $DEPLOY_DIR/
  sudo cp package.json $DEPLOY_DIR/
  md5sum package.json | awk '{print $1}' > package.json.md5
fi

# 设置正确的权限
echo "更新文件权限..."
sudo chown -R www-data:www-data $DEPLOY_DIR

# 重启Next.js应用
echo "重启Next.js应用..."
cd $DEPLOY_DIR
sudo -u www-data npm run start:prod &

echo "网站更新完成！" 
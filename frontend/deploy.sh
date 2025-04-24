#!/bin/bash

# 构建Next.js应用
echo "开始构建Next.js应用..."
npm run build

# 创建部署目录
DEPLOY_DIR="/var/www/html"
echo "准备部署目录: $DEPLOY_DIR"
sudo mkdir -p $DEPLOY_DIR

# 复制构建文件到部署目录
echo "复制文件到部署目录..."
sudo cp -R .next $DEPLOY_DIR/
sudo cp -R public $DEPLOY_DIR/
sudo cp -R node_modules $DEPLOY_DIR/
sudo cp package.json $DEPLOY_DIR/

# 设置正确的权限
echo "设置文件权限..."
sudo chown -R www-data:www-data $DEPLOY_DIR

# 移除旧的Nginx配置文件
echo "移除旧的Nginx配置文件..."
if [ -f "/etc/nginx/sites-enabled/nextjs" ]; then
    sudo rm /etc/nginx/sites-enabled/nextjs
fi

# 配置Nginx
echo "配置Nginx..."
NGINX_CONF="/etc/nginx/sites-available/reservation-nextjs"
sudo cp nginx.conf $NGINX_CONF

# 检查是否已有符号链接，如果有则移除
if [ -f "/etc/nginx/sites-enabled/reservation-nextjs" ]; then
    sudo rm /etc/nginx/sites-enabled/reservation-nextjs
fi

# 创建新的符号链接
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/

# 测试Nginx配置
echo "测试Nginx配置..."
sudo nginx -t

# 如果Nginx配置测试通过，重启Nginx
if [ $? -eq 0 ]; then
    echo "Nginx配置有效，重启Nginx..."
    sudo systemctl restart nginx
    echo "部署完成！"
else
    echo "Nginx配置有误，请检查错误并手动重启Nginx。"
    exit 1
fi

# 启动Next.js应用
echo "启动Next.js应用..."
cd $DEPLOY_DIR
npm run start:prod 
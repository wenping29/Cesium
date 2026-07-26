#!/bin/bash
CONTAINER_NAME="nginx"

echo "🔍 校验Nginx配置语法..."
docker exec ${CONTAINER_NAME} nginx -t

if [ $? -eq 0 ];then
    echo "✅ 配置合法，执行重载"
    docker exec ${CONTAINER_NAME} nginx -s reload
else
    echo "❌ 配置文件错误，请修复后重试！"
fi
#!/bin/bash
CONTAINER_NAME="nginx"

RUNNING=$(docker ps --filter "name=^/${CONTAINER_NAME}$" --quiet)
if [ -z "${RUNNING}" ];then
    echo "❌ Nginx容器未运行"
    exit 0
fi

echo "🛑 停止nginx容器"
docker stop ${CONTAINER_NAME}
echo "✅ 已停止"
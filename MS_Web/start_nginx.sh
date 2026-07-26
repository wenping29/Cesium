#!/bin/bash

CONTAINER_NAME="nginx"
CONF_ROOT="/home/sn/www/html/nginxconf"
WWW_ROOT="/home/sn/www/ms_web"

# 判断容器是否存在运行中
RUNNING=$(docker ps --filter "name=^/${CONTAINER_NAME}$" --quiet)
if [ -n "${RUNNING}" ];then
    echo "✅ Nginx容器正在运行，无需重复启动"
    exit 0
fi

# 判断容器已停止，则直接启动
STOPPED=$(docker ps -a --filter "name=^/${CONTAINER_NAME}$" --quiet)
if [ -n "${STOPPED}" ];then
    echo "🔄 发现停止的容器，执行启动：${CONTAINER_NAME}"
    docker start ${CONTAINER_NAME}
    exit 0
fi

echo "🚀 新建Nginx容器..."
docker run -d \
--name ${CONTAINER_NAME} \
-p 80:80 \
-p 443:443 \
-v ${CONF_ROOT}/nginx.conf:/etc/nginx/nginx.conf \
-v ${CONF_ROOT}/conf.d:/etc/nginx/conf.d \
-v ${WWW_ROOT}:/usr/share/nginx/html \
-v ${CONF_ROOT}/logs:/var/log/nginx \
--restart always \
nginx

echo "🎉 Nginx启动完成"
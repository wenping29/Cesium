#!/bin/bash
# WebAPI启动脚本

# 工作目录
APP_DIR="/home/sn/www/webapi"
# 程序名称
APP_NAME="CesiumApi"
# 监听地址端口
URLS="http://0.0.0.0:5000"

cd ${APP_DIR}

# 判断程序是否存在
if [ ! -f "./${APP_NAME}" ]; then
    echo "错误：找不到程序 ${APP_NAME}"
    exit 1
fi

# 判断是否已有进程在运行
PID=$(ps -ef | grep "./${APP_NAME}" | grep -v grep | awk '{print $2}')
if [ -n "${PID}" ]; then
    echo "程序正在运行，PID: ${PID}"
    exit 0
fi

echo "开始启动 ${APP_NAME}"
# 后台运行，输出日志到 app.log
nohup ./${APP_NAME} --urls "${URLS}" > app.log 2>&1 &
echo "启动完成，日志输出至 ${APP_DIR}/app.log"
echo "PID: $!"
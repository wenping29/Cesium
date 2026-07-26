#!/bin/bash
# WebAPI停止脚本

APP_NAME="CesiumApi"

PID=$(ps -ef | grep "./${APP_NAME}" | grep -v grep | awk '{print $2}')

if [ -z "${PID}" ]; then
    echo "未检测到运行中的 ${APP_NAME}"
    exit 0
fi

echo "找到进程 PID: ${PID}，准备优雅关闭"
kill ${PID}

# 等待5秒，超时强制杀死
sleep 5
PID_CHECK=$(ps -ef | grep "./${APP_NAME}" | grep -v grep | awk '{print $2}')
if [ -n "${PID_CHECK}" ]; then
    echo "进程未正常退出，强制kill"
    kill -9 ${PID_CHECK}
fi

echo "服务已停止"
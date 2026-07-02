#!/bin/bash
# ========================================================
# Cesium API - 数据库初始化脚本 (Linux/macOS)
# ========================================================

echo "========================================"
echo "Cesium API - 数据库初始化"
echo "========================================"
echo ""

# 检查是否存在旧数据库
if [ -f "cesium.db" ]; then
    echo "[警告] 检测到现有数据库文件 cesium.db"
    read -p "是否删除并重建？(y/N) " choice
    if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
        rm -f cesium.db
        echo "[OK] 已删除旧数据库"
    else
        echo "[跳过] 保留现有数据库"
        exit 0
    fi
fi

echo ""
echo "[1/2] 创建数据库结构..."

# 执行结构脚本
sqlite3 cesium.db < schema.sql

if [ $? -eq 0 ]; then
    echo "[OK] 数据库结构创建成功"
else
    echo "[错误] 数据库结构创建失败"
    exit 1
fi

echo ""
echo "[2/2] 导入测试数据..."

# 检查是否有 seed-data 项目
if [ -f "seed-data/SeedData.csproj" ]; then
    echo "[信息] 使用 .NET 程序生成测试数据（包含正确的密码哈希）"
    cd seed-data
    dotnet run
    cd ..
else
    echo "[警告] seed-data 项目不存在，跳过测试数据导入"
    echo "[提示] 可以通过运行 WebAPI 来创建用户"
fi

echo ""
echo "========================================"
echo "数据库初始化完成！"
echo "========================================"
echo ""
echo "数据库文件: cesium.db"
echo ""
echo "启动 WebAPI:"
echo "  dotnet run"
echo ""
echo "访问 Swagger:"
echo "  https://localhost:5001/swagger"
echo ""

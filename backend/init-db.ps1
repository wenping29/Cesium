# ========================================================
# Cesium API - 数据库初始化脚本
# ========================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cesium API - 数据库初始化" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否存在旧数据库
if (Test-Path "cesium.db") {
    Write-Host "[警告] 检测到现有数据库文件 cesium.db" -ForegroundColor Yellow
    $choice = Read-Host "是否删除并重建？(y/N)"
    if ($choice -eq "y" -or $choice -eq "Y") {
        Remove-Item "cesium.db" -Force
        Write-Host "[OK] 已删除旧数据库" -ForegroundColor Green
    } else {
        Write-Host "[跳过] 保留现有数据库" -ForegroundColor Gray
        exit 0
    }
}

Write-Host ""
Write-Host "[1/2] 创建数据库结构..." -ForegroundColor Cyan

# 执行结构脚本
sqlite3 cesium.db < schema.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] 数据库结构创建成功" -ForegroundColor Green
} else {
    Write-Host "[错误] 数据库结构创建失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/2] 导入测试数据..." -ForegroundColor Cyan

# 检查是否有 seed-data 项目
if (Test-Path "seed-data/SeedData.csproj") {
    Write-Host "[信息] 使用 .NET 程序生成测试数据（包含正确的密码哈希）" -ForegroundColor Yellow
    Push-Location "seed-data"
    dotnet run
    Pop-Location
} else {
    Write-Host "[警告] seed-data 项目不存在，跳过测试数据导入" -ForegroundColor Yellow
    Write-Host "[提示] 可以通过运行 WebAPI 来创建用户" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "数据库初始化完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "数据库文件: cesium.db" -ForegroundColor White
Write-Host ""
Write-Host "启动 WebAPI:" -ForegroundColor White
Write-Host "  dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "访问 Swagger:" -ForegroundColor White
Write-Host "  https://localhost:5001/swagger" -ForegroundColor Gray
Write-Host ""

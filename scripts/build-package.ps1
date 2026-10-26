# 生成部署包：后端 .NET WebAPI、MS_Web 生产前端、web 演示站，各自独立 zip 输出到仓库根 output/。
# 用法：
#   ./scripts/build-package.ps1                          # 三个都打
#   ./scripts/build-package.ps1 -Target backend          # 只打后端（framework-dependent）
#   ./scripts/build-package.ps1 -Target backend -SelfContained
#   ./scripts/build-package.ps1 -Target msweb,web        # 只打两个前端
#
# 注意：Windows PowerShell 5.1 按系统代码页读取无 BOM 的 .ps1，本文件必须保存为「UTF-8 with BOM」。
# 前端生产接口地址在构建时编译进产物，可用 $env:VITE_API_URL 覆盖（未设置则沿用 MS_Web/.env.production）。

param(
  [ValidateSet('backend', 'msweb', 'web', 'all')]
  [string[]] $Target = @('all'),

  # 后端发布为自包含（免装 .NET 运行时，包体约 60-90MB，需要能拉到 linux-x64 runtime pack）
  [switch] $SelfContained
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$OutRoot = Join-Path $RepoRoot 'output'
$StageRoot = Join-Path $OutRoot 'build'
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'

function Invoke-Step {
  param([string] $Name, [scriptblock] $Body)
  Write-Host "`n==> $Name" -ForegroundColor Cyan
  & $Body
  if ($LASTEXITCODE -ne 0) { throw "$Name 失败，退出码 $LASTEXITCODE" }
}

function Write-BuildInfo {
  param([string] $Path, [string] $Component, [string[]] $Lines)

  $gitBranch = (git -C $RepoRoot rev-parse --abbrev-ref HEAD).Trim()
  $gitSha = (git -C $RepoRoot rev-parse --short HEAD).Trim()
  $gitStatus = (git -C $RepoRoot status --porcelain | Measure-Object).Count

  $gitNote = if ($gitStatus -gt 0) { " (工作区有 $gitStatus 个未提交改动)" } else { '' }
  $header = @(
    "组件   : $Component",
    "构建时间: $Stamp",
    "Git    : $gitBranch @ $gitSha$gitNote",
    ""
  )
  Set-Content -Path $Path -Value ($header + $Lines) -Encoding UTF8
}

function New-Package {
  param([string] $Stage, [string] $ZipName)

  $zip = Join-Path $OutRoot $ZipName
  if (Test-Path $zip) { Remove-Item $zip -Force }
  Compress-Archive -Path (Join-Path $Stage '*') -DestinationPath $zip -CompressionLevel Optimal
  Remove-Item -Path $Stage -Recurse -Force
  if (-not (Get-ChildItem $StageRoot -ErrorAction SilentlyContinue)) { Remove-Item $StageRoot -Force }
  $sizeMB = [math]::Round((Get-Item $zip).Length / 1MB, 2)
  Write-Host "已生成 $zip ($sizeMB MB)" -ForegroundColor Green
  return $zip
}

function Build-Backend {
  $stage = Join-Path $StageRoot 'backend'
  if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
  New-Item -ItemType Directory -Path $stage -Force | Out-Null

  $project = Join-Path $RepoRoot 'backend/CesiumApi.csproj'
  $scFlag = if ($SelfContained) { 'true' } else { 'false' }

  Invoke-Step "dotnet publish (linux-x64, self-contained=$scFlag)" {
    dotnet publish $project -c Release -r linux-x64 --self-contained $scFlag -o $stage /p:UseAppHost=true
  }

  foreach ($sh in @('start.sh', 'stop.sh')) {
    Copy-Item (Join-Path $RepoRoot "backend/$sh") -Destination $stage
  }

  $runtimeNote = if ($SelfContained) { 'self-contained，服务器无需安装 .NET 运行时' } else { 'framework-dependent，服务器需已安装 .NET 8 运行时' }
  Write-BuildInfo -Path (Join-Path $stage 'BUILD_INFO.txt') -Component 'CesiumApi 后端' -Lines @(
    '部署目录：/home/sn/www/webapi（与 start.sh 中 APP_DIR 保持一致）',
    '启动/停止：./start.sh  |  ./stop.sh   日志：app.log',
    "运行形态：$runtimeNote",
    '注意：zip 不保留 Linux 可执行位，解压后先执行 chmod +x start.sh stop.sh',
    '注意：包内不含 cesium.db，生产库请使用独立数据库，并按需执行 EF 迁移或 schema SQL。',
    '配置：按需修改 appsettings.json（连接串、JWT Key、CORS 允许的前端来源）'
  )

  $suffix = if ($SelfContained) { 'sc' } else { 'fd' }
  New-Package -Stage $stage -ZipName "cesiumapi_backend_${Stamp}_${suffix}.zip"
}

function Build-MsWeb {
  $dir = Join-Path $RepoRoot 'MS_Web'
  $stage = Join-Path $StageRoot 'msweb'
  if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
  New-Item -ItemType Directory -Path $stage -Force | Out-Null

  Push-Location $dir
  try {
    if (-not (Test-Path 'node_modules')) {
      Invoke-Step 'npm ci (MS_Web)' { npm.cmd ci }
    }
    Invoke-Step 'npm run build (MS_Web)' { npm.cmd run build }
  }
  finally { Pop-Location }

  Copy-Item (Join-Path $dir 'dist\*') -Destination $stage -Recurse
  foreach ($sh in @('start_nginx.sh', 'stop_nginx.sh', 'reload_nginx.sh')) {
    Copy-Item (Join-Path $dir $sh) -Destination $stage
  }

  $apiUrl = if ($env:VITE_API_URL) { $env:VITE_API_URL } else { '未显式设置，取自 .env.production' }
  Write-BuildInfo -Path (Join-Path $stage 'BUILD_INFO.txt') -Component 'MS_Web 前端' -Lines @(
    '部署目录：/home/sn/www/ms_web（nginx 容器挂载为 /usr/share/nginx/html）',
    '发布：解压覆盖目录后 ./reload_nginx.sh 即可，无需重启容器',
    '注意：zip 不保留 Linux 可执行位，解压后先执行 chmod +x *_nginx.sh',
    'VITE_ 环境变量已在本机构建时编译进产物（含天地图 Token），改配置需重新打包。',
    "接口地址 VITE_API_URL：$apiUrl",
    'SPA 路由需 nginx 配置 try_files $uri $uri/ /index.html，详见 DEPLOY.md'
  )

  New-Package -Stage $stage -ZipName "ms_web_${Stamp}.zip"
}

function Build-Web {
  $dir = Join-Path $RepoRoot 'web'
  $stage = Join-Path $StageRoot 'web'
  if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
  New-Item -ItemType Directory -Path $stage -Force | Out-Null

  Push-Location $dir
  try {
    if (-not (Test-Path 'node_modules')) {
      Invoke-Step 'npm ci (web)' { npm.cmd ci }
    }
    Invoke-Step 'npm run build (web)' { npm.cmd run build }
  }
  finally { Pop-Location }

  Copy-Item (Join-Path $dir 'dist\*') -Destination $stage -Recurse

  Write-BuildInfo -Path (Join-Path $stage 'BUILD_INFO.txt') -Component 'web 演示站（Mock 数据，无后端）' -Lines @(
    '纯静态站点，任意静态服务器或直接 nginx 目录即可托管',
    '菜单/登录等接口由前端 mockjs 拦截，不依赖 backend'
  )

  New-Package -Stage $stage -ZipName "web_demo_${Stamp}.zip"
}

New-Item -ItemType Directory -Path $OutRoot -Force | Out-Null

$targets = if ($Target -contains 'all') { @('backend', 'msweb', 'web') } else { $Target }
$results = @()
foreach ($t in $targets) {
  switch ($t) {
    'backend' { $results += Build-Backend }
    'msweb' { $results += Build-MsWeb }
    'web' { $results += Build-Web }
  }
}

Write-Host "`n==> 打包完成" -ForegroundColor Cyan
$results | ForEach-Object { Write-Host "  $_" }

@echo off
echo ========================================
echo Vue 项目构建修复脚本
echo ========================================
echo.

echo 1. 清理 node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ 已删除 node_modules
) else (
    echo ✓ node_modules 不存在
)

echo.
echo 2. 清理构建缓存...
if exist dist (
    rmdir /s /q dist
    echo ✓ 已删除 dist 目录
)

if exist .cache (
    rmdir /s /q .cache
    echo ✓ 已删除 .cache 目录
)

echo.
echo 3. 重新安装依赖...
call npm install
echo ✓ 依赖安装完成

echo.
echo 4. 安装 Vue 3 必需的编译依赖...
call npm install @vue/compiler-sfc --save-dev
echo ✓ Vue 编译器安装完成

echo.
echo ========================================
echo 修复完成！请运行以下命令：
echo.
echo npm run serve    - 启动开发服务器
echo npm run build    - 构建生产版本
echo ========================================
pause
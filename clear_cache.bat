@echo off
echo 清理浏览器缓存和构建文件...
echo.

REM 删除dist目录中的构建文件（如果有缓存问题）
if exist "dist" (
    echo 删除dist目录...
    rmdir /s /q "dist"
)

REM 停止开发服务器（如果有运行）
echo.
echo 注意：请确保开发服务器已停止运行！
echo 在运行此脚本前，按 Ctrl+C 停止 npm run serve
echo.

REM 清除浏览器缓存建议
echo.
echo ======================================
echo 路径配置已修复，需要清除浏览器缓存！
echo ======================================
echo.
echo 修复内容：
echo 1. publicPath 从 './' 改为 '/'（解决不同路由下的图标404问题）
echo 2. index.html 中的图标路径改为绝对路径
echo 3. 删除了导致重复挂载的 script 标签
echo.
echo 请执行以下操作：
echo.
echo [第一步] 重启开发服务器：
echo    1. 在命令行中执行: npm run serve
echo    2. 如果首次运行或依赖有问题: npm install
echo.
echo [第二步] 清除浏览器缓存：
echo    按 F12 打开开发者工具
echo    右键点击刷新按钮 → "清空缓存并硬性重新加载"
echo    或者使用快捷键: Ctrl+Shift+R
echo.
echo [第三步] 验证修复：
echo    1. 访问 http://localhost:8080
echo    2. 访问 http://localhost:8080/who_i_am
echo    3. 检查控制台是否还有 404 错误
echo ======================================
echo.
echo 现在请按照上述步骤操作...
pause
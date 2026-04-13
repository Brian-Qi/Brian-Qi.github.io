@echo off
echo 重启开发服务器步骤：
echo.
echo 1. 清理缓存（如果之前还在运行）：
echo    在命令行中按 Ctrl+C 停止当前开发服务器
echo.
echo 2. 重新安装依赖（如果需要）：
echo    npm install
echo.
echo 3. 启动开发服务器：
echo    npm run serve
echo.
echo 4. 访问地址：
echo    http://localhost:8080
echo.
echo 5. 在浏览器中清空缓存（重要！）：
echo    按 F12 → 右键刷新按钮 → "清空缓存并硬性重新加载"
echo.
echo ======================================
echo 修复内容：
echo 1. 已将 publicPath 从 './' 改为 '/'（解决图标404问题）
echo 2. 已修复 index.html 中的图标路径
echo 3. 已删除可能导致重复挂载的 script 标签
echo ======================================
echo.
pause
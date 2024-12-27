<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>网址监测器</title>
    <link rel="stylesheet" href="styles.css"> <!-- 引入样式 -->
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9e5; /* 浅黄色背景 */
            color: #333;
            margin: 0; /* 移除默认边距 */
            padding: 0; /* 移除默认内边距 */
        }

        .container {
            max-width: 90%; /* 容器最大宽度为90% */
            width: 600px; /* 最大宽度为600px */
            margin: auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h1 {
            text-align: center;
        }

        form {
            display: flex;
            flex-wrap: wrap; /* 允许换行以适应小屏幕 */
        }

        input {
            flex: 1 1 auto; /* 自适应宽度 */
            margin-right: 10px;
            padding: 10px;
        }

        button {
            padding: 10px 15px;
        }

        #results {
            margin-top: 20px;
        }

        .status-normal {
            color: green; /* 正常状态显示为绿色 */
        }

        .status-error {
            color: red; /* 错误状态显示为红色 */
        }

        #websiteList {
            list-style-type: none; /* 移除列表样式 */
            padding: 0; /* 移除内边距 */
        }

        #websiteList li {
            display: flex;
            justify-content: space-between; /* 确保文本和按钮对齐 */
            align-items: center; /* 垂直居中对齐 */
            margin-bottom: 10px; /* 每个条目之间的间距 */
        }

        #websiteList button {
            margin-left: 10px; /* 按钮之间的间距 */
        }

        button.delete {
            background-color: red; /* 删除按钮为红色 */
            color: white;
        }

        button.modify {
            background-color: yellow; /* 修改按钮为黄色 */
        }

        button.default {
            background-color: green; /* 默认按钮为绿色 */
        }

        @media (max-width: 600px) {
            .container {
                width: 95%; /* 在小屏幕上容器宽度为95% */
                padding: 10px; /* 减少内边距 */
            }

            form {
                flex-direction: column; /* 垂直排列输入框和按钮 */
                align-items: stretch; /* 按钮和输入框占满整个宽度 */
            }

            input {
                margin-right: 0; /* 移除右边距以适应垂直排列 */
                margin-bottom: 10px; /* 添加底部间距以分隔输入框和按钮 */
                width: auto; /* 自适应宽度 */
            }

            button {
                width: 100%; /* 按钮占满整个宽度 */
                margin-left: 0; /* 移除左边距以适应全宽 */
                margin-bottom: 5px; /* 添加底部间距以分隔按钮 */
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>网址监测器</h1>
        <form id="monitorForm">
            <input type="text" id="url" placeholder="输入网址 (例如 https://example.com)" required>
            <input type="text" id="name" placeholder="输入网站名称" required>
            <button type="submit" class="default">添加监测</button> <!-- 添加监测按钮 -->
        </form>
        
        <button id="startMonitoring" class="default">开始检测所有网站</button> <!-- 开始检测按钮 -->
        
        <button id="exportList" class="default">导出监测列表</button> <!-- 导出按钮 -->
        
        <ul id="websiteList"></ul> <!-- 显示监测的网站列表 -->
    </div>

    <script>
        let monitoredWebsites = []; // 存储监测的网站及其状态

        // 表单提交事件处理
        document.getElementById('monitorForm').addEventListener('submit', function(event) {
            event.preventDefault(); // 防止表单默认提交
            const url = document.getElementById('url').value;
            const name = document.getElementById('name').value;

            // 添加网站到监测列表
            addWebsite(url, name);
            
            // 更新显示的网站列表
            displayWebsites();

            // 清空输入框
            document.getElementById('url').value = '';
            document.getElementById('name').value = '';
        });

        // 添加网站到监测列表
        function addWebsite(url, name) {
            monitoredWebsites.push({ url, name, status: '未检测' });
        }

        // 显示当前监测的网站
        function displayWebsites() {
            const websiteList = document.getElementById('websiteList');
            websiteList.innerHTML = ''; // 清空现有列表

            monitoredWebsites.forEach(website => {
                const listItem = document.createElement('li');
                listItem.textContent = `${website.name}: ${website.url} - 状态: ${website.status}`;
                listItem.className = website.status === '在线' ? 'status-normal' : (website.status === '离线' ? 'status-error' : '');
                websiteList.appendChild(listItem);
            });
        }

        // 开始检测所有网站
        document.getElementById('startMonitoring').addEventListener('click', function() {
            monitoredWebsites.forEach(website => {
                checkWebsite(website);
            });
        });

        // 检查单个网站的状态
        function checkWebsite(website) {
          fetch(website.url, { method: 'HEAD' })
              .then(response => {
                  website.status = response.ok ? '在线' : '离线';
                  displayWebsites();
              })
              .catch(() => {
                  website.status = '离线';
                  displayWebsites();
              });
      }

      // 导出带有检测结果的列表
      document.getElementById('exportList').addEventListener('click', function() {
          if (monitoredWebsites.length === 0) {
              alert("没有监测的网站可导出。");
              return;
          }
          
          const dataStr = JSON.stringify(monitoredWebsites, null, 2); // 将数据转换为 JSON 字符串
          const blob = new Blob([dataStr], { type: 'application/json' }); // 创建 Blob 对象
          const url = URL.createObjectURL(blob); // 创建下载链接

          const a = document.createElement('a');
          a.href = url;
          a.download = 'monitored_websites_with_results.json'; // 设置下载文件名
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      });
    </script>
</body>
</html>

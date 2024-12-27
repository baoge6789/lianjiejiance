<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>网站列表</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9e5; /* 浅黄色背景 */
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h1 {
            text-align: center;
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

        button.delete {
            background-color: red; /* 删除按钮为红色 */
            color: white;
            margin-left: 10px; /* 按钮之间的间距 */
        }

        button.modify {
            background-color: yellow; /* 修改按钮为黄色 */
            margin-left: 10px; /* 按钮之间的间距 */
        }
    </style>
</head>
<body>

<div class="container">
    <h1>网站列表</h1>
    <ul id="websiteList">
        <li>
            <span class="website-name" onclick="toggleEdit('row0')">网站名称</span>
            <button class="delete" onclick="dele('row0')">删除</button>
            <button class="modify" id="modify-row0" style="display:none;" onclick="editL('row0')">修改</button>
        </li>
    </ul>
</div>

<script>
function toggleEdit(rowId) {
    var modifyButton = document.getElementById('modify-' + rowId);
    
    // 切换修改按钮的显示状态
    if (modifyButton.style.display === "none") {
        modifyButton.style.display = "inline-block"; // 显示修改按钮
    } else {
        modifyButton.style.display = "none"; // 隐藏修改按钮
    }
}

function dele(rowId) {
    // 删除逻辑
}

function editL(rowId) {
    // 修改逻辑
}
</script>

</body>
</html>

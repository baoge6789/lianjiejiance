document.getElementById('monitorForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // 阻止默认提交行为

    const url = document.getElementById('url').value; // 获取输入的网址
    const name = document.getElementById('name').value; // 获取输入的网站名称

    // 使用您的 Worker URL
    const response = await fetch(`https://jiance.wangsir666998.workers.dev/?target=${encodeURIComponent(url)},${encodeURIComponent(name)}`);
    
    const resultText = await response.text(); // 获取响应文本
    
    const resultsDiv = document.getElementById('results'); // 获取结果显示区域
    
    const resultElement = document.createElement('div'); // 创建新的结果元素
    
    if (response.ok) {
        resultElement.className = 'status-normal'; // 正常状态
        resultElement.innerText = resultText; // 显示正常状态信息
    } else {
        resultElement.className = 'status-error'; // 错误状态
        resultElement.innerText = resultText; // 显示错误信息
    }

    resultsDiv.appendChild(resultElement); // 将结果添加到显示区域
});

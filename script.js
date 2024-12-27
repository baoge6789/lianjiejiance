document.getElementById('monitorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认提交行为

    const url = document.getElementById('url').value; // 获取输入的网址
    const name = document.getElementById('name').value; // 获取输入的网站名称

    // 将新网站添加到本地存储
    addWebsiteToList(url, name);
    displayWebsiteList();
});

document.getElementById('startMonitoring').addEventListener('click', async function() {
    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    for (const website of websites) {
        const response = await fetch(`https://jiance.wangsir666998.workers.dev/?target=${encodeURIComponent(website.url)},${encodeURIComponent(website.name)}`);
        const resultText = await response.text();
        displayResult(resultText);
    }
});

// 添加新网站到本地存储
function addWebsiteToList(url, name) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    websites.push({ url, name });
    localStorage.setItem('websites', JSON.stringify(websites));
}

// 显示当前监测的网站列表
function displayWebsiteList() {
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = ''; // 清空列表

    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    websites.forEach(website => {
        const listItem = document.createElement('li');
        listItem.textContent = `${website.name} (${website.url})`;
        websiteList.appendChild(listItem);
    });
}

// 显示检测结果
function displayResult(resultText) {
    const resultsDiv = document.getElementById('results');
    
    const resultElement = document.createElement('div');
    
    if (resultText.includes("正在运行")) {
        resultElement.className = 'status-normal'; // 正常状态
        resultElement.innerText = resultText; // 显示正常状态信息
    } else {
        resultElement.className = 'status-error'; // 错误状态
        resultElement.innerText = resultText; // 显示错误信息
    }

    resultsDiv.appendChild(resultElement); // 将结果添加到显示区域
}

// 页面加载时显示已保存的网站列表
window.onload = function() {
    displayWebsiteList();
};

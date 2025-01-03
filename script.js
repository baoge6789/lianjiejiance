// 监听表单提交事件
document.getElementById('monitorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默认提交行为
    const url = document.getElementById('url').value; // 获取输入的网址
    const name = document.getElementById('name').value; // 获取输入的网站名称
    // 检查是否为重复网址
    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    const isDuplicate = websites.some(website => website.url === url);
    
    if (isDuplicate) {
        alert("该网址已存在，请输入不同的网址。");
        return;
    }
    addWebsiteToList(url, name); // 将新网站添加到本地存储
    displayWebsiteList(); // 显示当前监测的网站列表
});
// 展开/收起按钮逻辑
document.getElementById('toggleWebsiteList').addEventListener('click', function() {
    const websiteList = document.getElementById('websiteList');
    if (websiteList.style.display === 'none' || websiteList.style.display === '') {
        websiteList.style.display = 'block'; // 展开列表
        this.textContent = '收起列表'; // 改变按钮文本
    } else {
        websiteList.style.display = 'none'; // 收起列表
        this.textContent = '展开列表'; // 改变按钮文本
    }
});

// 检测全部网址的逻辑
document.getElementById('startMonitoring').addEventListener('click', async function() {
    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    for (const website of websites) {
        const response = await fetch(`https://jiance.baoge.us.kg/?target=${encodeURIComponent(website.url)},${encodeURIComponent(website.name)}`);
        const resultText = await response.text();
        displayResult(website.name, resultText); // 显示结果时使用网站名称
    }
});

// 检测刚添加的网址的逻辑
document.getElementById('checkLastAdded').addEventListener('click', async function() {
    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    if (websites.length === 0) {
        alert("没有可检测的网址。");
        return;
    }

    const lastWebsite = websites[websites.length - 1]; // 获取最后添加的网址
    const response = await fetch(`https://jiance.baoge.us.kg/?target=${encodeURIComponent(lastWebsite.url)},${encodeURIComponent(lastWebsite.name)}`);
    const resultText = await response.text();
    displayResult(lastWebsite.name, resultText); // 显示结果时使用网站名称
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
    
    websites.forEach((website, index) => {
        const listItem = document.createElement('li');
        
        // 创建链接并添加鼠标悬停效果
        const link = document.createElement('span');
        link.textContent = website.name; // 显示网站名称
        link.title = website.url; // 鼠标悬停时显示网址
        
        listItem.appendChild(link);

        // 创建修改按钮
        const editButton = document.createElement('button');
        editButton.textContent = '修改';
        editButton.className = 'modify';
        editButton.onclick = () => { modifyWebsite(index); };

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => { deleteWebsite(index); };

        // 将按钮添加到列表项中
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        
        websiteList.appendChild(listItem);
    });
}

// 删除网站
function deleteWebsite(index) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    websites.splice(index, 1); // 删除指定索引的网站
    localStorage.setItem('websites', JSON.stringify(websites)); // 更新本地存储
    displayWebsiteList(); // 更新显示列表
}

// 修改网站
function modifyWebsite(index) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    const newUrl = prompt("请输入新的网址", websites[index].url);
    const newName = prompt("请输入新的网站名称", websites[index].name);
    
    if (newUrl && newName) {
        websites[index] = { url: newUrl, name: newName }; // 更新指定索引的网站信息
        localStorage.setItem('websites', JSON.stringify(websites)); // 更新本地存储
        displayWebsiteList(); // 更新显示列表
    }
}

// 显示检测结果的函数
function displayResult(name, resultText) {
    const resultsDiv = document.getElementById('results');
    
    const resultElement = document.createElement('div');
    
    resultElement.innerText = `${name}: ${resultText}`; // 显示结果文本
    
    if (resultText.includes("正常运行")) {
        resultElement.className = 'status-normal';
    } else {
        resultElement.className = 'status-error';
    }

    resultsDiv.appendChild(resultElement);
}

// 页面加载时显示已保存的网站列表，默认收起状态
window.onload = function() {
   displayWebsiteList();
   document.getElementById('websiteList').style.display = 'none'; // 默认隐藏列表
};

// 监听开始检测按钮点击事件
document.getElementById('startMonitoring').addEventListener('click', async function() {
    const websites = JSON.parse(localStorage.getItem('websites')) || [];
    
    // 初始化计数器和失败网址数组
    let totalCount = websites.length;
    let successCount = 0;
    let failureCount = 0;
    let failedUrls = [];

    for (const website of websites) {
        const response = await fetch(`https://jiance.baoge.us.kg/?target=${encodeURIComponent(website.url)},${encodeURIComponent(website.name)}`);
        const resultText = await response.text();
        displayResult(website.name, resultText); // 显示结果时使用网站名称

        // 检查结果并更新计数器
        if (resultText.includes("正常运行")) {
            successCount++;
        } else {
            failureCount++;
            failedUrls.push(website.name); // 添加到失败网址列表
        }
    }

    // 显示总结结果
    displaySummaryResults(totalCount, successCount, failureCount, failedUrls);
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
    
    websites.forEach((website, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('span');
        link.textContent = website.name; // 显示网站名称
        link.title = website.url; // 鼠标悬停时显示网址
        listItem.appendChild(link);

        const editButton = document.createElement('button');
        editButton.textContent = '修改';
        editButton.className = 'modify';
        editButton.onclick = () => { modifyWebsite(index); };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => { deleteWebsite(index); };

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        websiteList.appendChild(listItem);
    });
}

// 删除网站
function deleteWebsite(index) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    websites.splice(index, 1); // 删除指定索引的网站
    localStorage.setItem('websites', JSON.stringify(websites)); // 更新本地存储
    displayWebsiteList(); // 更新显示列表
}

// 修改网站
function modifyWebsite(index) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    const newUrl = prompt("请输入新的网址", websites[index].url);
    const newName = prompt("请输入新的网站名称", websites[index].name);
    
    if (newUrl && newName) {
        websites[index] = { url: newUrl, name: newName }; // 更新指定索引的网站信息
        localStorage.setItem('websites', JSON.stringify(websites)); // 更新本地存储
        displayWebsiteList(); // 更新显示列表
    }
}

// 显示检测结果的函数
function displayResult(name, resultText) {
    const resultsDiv = document.getElementById('results');
    
    if (!resultsDiv) return; // 如果没有找到 resultsDiv，直接返回

    const resultElement = document.createElement('div');
    
    resultElement.innerText = `${name}: ${resultText}`; // 显示结果文本
    
    if (resultText.includes("正常运行")) {
        resultElement.className = 'status-normal';
    } else {
        resultElement.className = 'status-error';
    }

    resultsDiv.appendChild(resultElement);
}

// 显示总结结果的函数
function displaySummaryResults(total, success, failure, failedUrls) {
    const summaryDiv = document.createElement('div');
    
    summaryDiv.innerHTML = `
        <h3>检测结果</h3>
        <p>总网址个数: ${total}</p>
        <p>成功连通: ${success}</p>
        <p>检测失败: ${failure}</p>
        <p>失败的网址名称: ${failedUrls.join(', ') || '无'}</p>
    `;
    
    // 将总结插入到“开始检测”按钮下方
    const startButtonContainer = document.getElementById('startMonitoring').parentNode;
    
    // 清除之前的总结结果（如果存在）
    const existingSummaryDiv = document.querySelector('#summaryResults');
    if (existingSummaryDiv) existingSummaryDiv.remove();

    summaryDiv.id = 'summaryResults'; // 设置ID以便后续清除或更新
    startButtonContainer.insertBefore(summaryDiv, startButtonContainer.children[1]);
}

// 页面加载时显示已保存的网站列表
window.onload = function() {
    displayWebsiteList();
};

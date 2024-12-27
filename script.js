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
        const response = await fetch(`https://jiance.baoge.us.kg/?target=${encodeURIComponent(website.url)},${encodeURIComponent(website.name)}`);
        const resultText = await response.text();
        displayResult(website.name, resultText); // 显示结果时使用网站名称
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
        editButton.onclick = () => {
            modifyWebsite(index);
        };

        // 创建删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => {
            deleteWebsite(index);
        };

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

// 显示检测结果
function displayResult(name, resultText) {
   const resultsDiv = document.getElementById('results');
    
   const resultElement = document.createElement('div');
    
   resultElement.innerText = resultText; // 显示结果文本 
   
   if (resultText.includes("正常运行")) { 
       resultElement.className = 'status-normal'; 
   } else { 
       resultElement.className = 'status-error'; 
   }

   resultsDiv.appendChild(resultElement); 
}

// 页面加载时显示已保存的网站列表
window.onload = function() {
   displayWebsiteList();
};// 初始化一个数组来存储监测的网站
let monitoredWebsites = [];

// 处理表单提交
document.getElementById('monitorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 防止表单默认提交

    // 获取用户输入的网址和名称
    const url = document.getElementById('url').value;
    const name = document.getElementById('name').value;

    // 将新网站添加到数组中
    monitoredWebsites.push({ url, name });

    // 更新显示的网站列表
    updateWebsiteList();

    // 清空输入框
    document.getElementById('url').value = '';
    document.getElementById('name').value = '';
});

// 更新网站列表的函数
function updateWebsiteList() {
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = ''; // 清空现有列表

    monitoredWebsites.forEach((website, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${website.name}: ${website.url}`;
        websiteList.appendChild(listItem);
    });
}

// 导出监测列表的函数
document.getElementById('exportList').addEventListener('click', function() {
    const dataStr = JSON.stringify(monitoredWebsites, null, 2); // 将数据转换为 JSON 字符串
    const blob = new Blob([dataStr], { type: 'application/json' }); // 创建 Blob 对象
    const url = URL.createObjectURL(blob); // 创建下载链接

    // 创建一个临时链接并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monitored_websites.json'; // 设置下载文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});



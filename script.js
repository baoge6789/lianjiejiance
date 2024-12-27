document.getElementById('monitorForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const name = document.getElementById('name').value;

    // 使用您的 Worker URL
    const response = await fetch(`https://jiance.baoge.us.kg/?target=${encodeURIComponent(url)},${encodeURIComponent(name)}`);
    
    const resultText = await response.text();
    
    const resultsDiv = document.getElementById('results');
    
    const resultElement = document.createElement('div');
    
    if (response.ok) {
        resultElement.className = 'status-normal';
        resultElement.innerText = resultText; // 显示正常状态
    } else {
        resultElement.className = 'status-error';
        resultElement.innerText = resultText; // 显示错误状态
    }

    resultsDiv.appendChild(resultElement);
});

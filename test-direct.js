const http = require('http');

function makeRequest(path, method = 'GET') {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Accept': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${res.statusCode}] ${method} ${path}`);
                if (res.statusCode >= 400) {
                    console.log(`Response: ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Error requesting ${path}:`, e.message);
            resolve();
        });

        req.end();
    });
}

async function run() {
    console.log('Testing backend endpoints directly on port 3000...');
    await makeRequest('/api/health', 'GET');
    await makeRequest('/api/auth/me', 'GET');
    await makeRequest('/api/auth/logout', 'POST');
    await makeRequest('/api/tasks', 'GET');
}

run();

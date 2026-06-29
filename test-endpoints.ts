import http from 'http';

const checkEndpoint = (path: string) => {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${res.statusCode}] GET ${path}:`, data.substring(0, 100));
                resolve(res.statusCode);
            });
        });
        
        req.on('error', (e) => {
            console.error(`Error requesting ${path}:`, e.message);
            resolve(0);
        });
        
        req.end();
    });
};

const checkPost = (path: string) => {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST'
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${res.statusCode}] POST ${path}:`, data.substring(0, 100));
                resolve(res.statusCode);
            });
        });
        
        req.on('error', (e) => {
            console.error(`Error requesting ${path}:`, e.message);
            resolve(0);
        });
        
        req.end();
    });
};

async function run() {
    await checkEndpoint('/api/health');
    await checkEndpoint('/api/auth/me');
    await checkPost('/api/auth/logout');
    await checkEndpoint('/api/tasks');
}

run();

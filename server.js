import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;

// Map file extensions to MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // Serve index.html for root requests
    const urlPath = req.url === '/' ? '/index.html' : req.url;

    // Protection against directory enumeration
    const ASSETS = path.resolve('./assets'), SCRIPTS = path.resolve('./scripts');
    const decodedPath = decodeURIComponent(urlPath); // Decode URL (%20, etc.)
    if (urlPath !== '/index.html' &&
        !path.resolve(decodedPath).startsWith('/assets/') &&
        !path.resolve(decodedPath).startsWith('/scripts/')
    ) { // Prevent path traversal
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 - Forbidden');
    }

    // Resolve file path relative to this server.js file
    const filePath = path.join('.', urlPath); // __dirname
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 — File not found: ${urlPath}`);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`500 — Internal server error: ${err.message}`);
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Tetris server running at http://localhost:${PORT}`);
});
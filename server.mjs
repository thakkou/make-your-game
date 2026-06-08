import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3000;

// Map file extensions to MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    // '.json': 'application/json',
    // '.png': 'image/png',
    // '.jpg': 'image/jpeg',
    // '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // Serve index.html for root requests
    const urlPath = req.url === '/' ? '/index.html' : req.url;

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
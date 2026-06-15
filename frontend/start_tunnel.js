import localtunnel from 'localtunnel';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const urlFilePath = path.join(__dirname, '..', 'tunnel_url.txt');

const intervalId = setInterval(() => {
  // Keep Node.js event loop active
}, 5000);

(async () => {
  try {
    console.log('Connecting to LocalTunnel on port 8000...');
    const tunnel = await localtunnel({ port: 8000 });
    
    console.log('Tunnel URL:', tunnel.url);
    
    // Write URL immediately
    fs.writeFileSync(urlFilePath, tunnel.url, 'utf8');
    console.log('Wrote URL to:', urlFilePath);
    
    tunnel.on('close', () => {
      console.log('Tunnel closed.');
      clearInterval(intervalId);
      try {
        fs.unlinkSync(urlFilePath);
      } catch (err) {}
      process.exit(0);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      clearInterval(intervalId);
      try {
        fs.unlinkSync(urlFilePath);
      } catch (e) {}
      process.exit(1);
    });
    
  } catch (err) {
    console.error('Error starting tunnel:', err);
    clearInterval(intervalId);
    process.exit(1);
  }
})();

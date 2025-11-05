import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SCRIPT_TAG = '<script src="/dashboard-console-capture.js"></script>';
const DIST_DIR = 'dist';

function injectScript(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    
    if (content.includes('dashboard-console-capture.js')) {
      console.log(`Already injected: ${filePath}`);
      return;
    }
    
    if (content.includes('</head>')) {
      content = content.replace('</head>', `  ${SCRIPT_TAG}\n  </head>`);
      writeFileSync(filePath, content, 'utf-8');
      console.log(`Injected into: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(directory) {
  try {
    const items = readdirSync(directory);
    
    for (const item of items) {
      const fullPath = join(directory, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item.endsWith('.html')) {
        injectScript(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
  }
}

console.log('Starting console capture script injection...');
processDirectory(DIST_DIR);
console.log('Console capture script injection complete!');
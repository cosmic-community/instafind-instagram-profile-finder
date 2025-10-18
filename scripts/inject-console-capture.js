const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), '.next');

if (!fs.existsSync(buildDir)) {
  console.log('No .next directory found, skipping console capture injection');
  process.exit(0);
}

const scriptTag = '<script src="/dashboard-console-capture.js"></script>';

function injectScript(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('dashboard-console-capture.js')) {
    return false;
  }
  
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${scriptTag}</head>`);
  } else if (content.includes('<body')) {
    content = content.replace('<body', `<body>${scriptTag}`);
  } else {
    return false;
  }
  
  fs.writeFileSync(filePath, content);
  return true;
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let injectedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      injectedCount += walkDirectory(filePath);
    } else if (file.endsWith('.html')) {
      if (injectScript(filePath)) {
        injectedCount++;
      }
    }
  });
  
  return injectedCount;
}

const injected = walkDirectory(buildDir);
console.log(`Console capture script injected into ${injected} HTML files`);
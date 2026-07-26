const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Check if file contains "use client" or 'use client'
  const hasUseClient = /['"]use client['"];?/.test(content);
  
  if (hasUseClient) {
    // Remove all occurrences
    content = content.replace(/['"]use client['"];?\n?/g, '');
    // Prepend to the very top
    content = '"use client";\n' + content;
    changed = true;
  }
  
  // Also check the specific files that Next.js complained about, even if they didn't have use client.
  // Wait, if they use useState, they probably need "use client".
  if (!hasUseClient && (content.includes('useState(') || content.includes('useEffect('))) {
     content = '"use client";\n' + content;
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Done fixing use client directives');

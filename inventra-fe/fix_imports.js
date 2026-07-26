const fs = require('fs');
const glob = require('glob'); // npm i -g glob might be needed? We can just use recursive fs.
const path = require('path');

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

  // If the file uses <Trans> or <Trans id=
  if (content.includes('<Trans')) {
    // Check if imported from @lingui/react
    if (content.includes('import { Trans } from "@lingui/react"')) {
      content = content.replace('import { Trans } from "@lingui/react"', 'import { Trans } from "@lingui/macro"');
      changed = true;
    } else if (content.includes("import { Trans } from '@lingui/react'")) {
      content = content.replace("import { Trans } from '@lingui/react'", "import { Trans } from '@lingui/macro'");
      changed = true;
    } else if (content.match(/import\s+\{[^}]*\bTrans\b[^}]*\}\s+from\s+['"]@lingui\/react['"]/)) {
       // if they import { Trans, useLingui } from '@lingui/react'
       content = content.replace(/(import\s+\{[^}]*)\bTrans\b,?([^}]*\}\s+from\s+['"]@lingui\/react['"])/, '$1$2');
       // after removal, we might have { , useLingui } which is bad, let's just do a simpler replace
       // Let's just prepend the macro import.
       content = `import { Trans } from "@lingui/macro";\n` + content;
       changed = true;
    } else if (!content.includes('import { Trans } from "@lingui/macro"') && !content.includes("import { Trans } from '@lingui/macro'")) {
      // Missing import
      content = `import { Trans } from "@lingui/macro";\n` + content;
      changed = true;
    }
  }

  // Cleanup bad imports like { , useLingui }
  content = content.replace(/import\s+\{\s*,\s*useLingui\s*\}\s+from\s+['"]@lingui\/react['"]/g, 'import { useLingui } from "@lingui/react"');
  content = content.replace(/import\s+\{\s*useLingui\s*,\s*\}\s+from\s+['"]@lingui\/react['"]/g, 'import { useLingui } from "@lingui/react"');

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Done fixing Trans imports');

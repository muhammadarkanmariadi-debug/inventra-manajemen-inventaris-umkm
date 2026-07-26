const fs = require('fs');
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

  // Replace <Trans id="Something" /> with <Trans>Something</Trans>
  const transRegex = /<Trans\s+id=(['"])(.*?)\1\s*\/>/g;
  if (transRegex.test(content)) {
    content = content.replace(transRegex, '<Trans>$2</Trans>');
    changed = true;
  }
  
  // Replace <Trans id={"Something"} /> with <Trans>Something</Trans>
  const transRegexBraces = /<Trans\s+id=\{(['"])(.*?)\1\}\s*\/>/g;
  if (transRegexBraces.test(content)) {
    content = content.replace(transRegexBraces, '<Trans>$2</Trans>');
    changed = true;
  }

  // Replace useLingui() with useTranslate() from hooks
  if (content.includes('useLingui()')) {
    content = content.replace(/useLingui\(\)/g, 'useTranslate()');
    
    // update imports
    if (content.includes('import { useLingui } from "@lingui/react"')) {
      content = content.replace('import { useLingui } from "@lingui/react"', 'import { useTranslate } from "@/hooks/useTranslate"');
    } else if (content.includes("import { useLingui } from '@lingui/react'")) {
      content = content.replace("import { useLingui } from '@lingui/react'", 'import { useTranslate } from "@/hooks/useTranslate"');
    } else if (content.match(/import\s+\{\s*useLingui\s*\}\s+from\s+['"]@lingui\/react['"]/)) {
      content = content.replace(/import\s+\{\s*useLingui\s*\}\s+from\s+['"]@lingui\/react['"]/, 'import { useTranslate } from "@/hooks/useTranslate"');
    } else {
      // If it still imports from @lingui/react with something else, we need to add the import.
      if (!content.includes('import { useTranslate }')) {
        content = `import { useTranslate } from "@/hooks/useTranslate";\n` + content;
      }
    }
    changed = true;
  }

  // Remove duplicate/unused useLingui imports just in case
  content = content.replace(/import\s+\{\s*useLingui\s*\}\s+from\s+['"]@lingui\/react['"];?\n/g, '');

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Done fixing Trans id and useTranslate');

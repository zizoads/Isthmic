import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
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
  if (content.includes('gemini-1.5-flash')) {
    content = content.replace(/gemini-1.5-flash/g, 'gemini-3-flash-preview');
    changed = true;
  }
  if (content.includes('gemini-1.5-pro')) {
    content = content.replace(/gemini-1.5-pro/g, 'gemini-3.1-pro-preview');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});

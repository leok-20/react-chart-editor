const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Update React and React DOM peerDependencies
if (pkg.peerDependencies) {
  if (pkg.peerDependencies.react) pkg.peerDependencies.react = "^19.0.0";
  if (pkg.peerDependencies['react-dom']) pkg.peerDependencies['react-dom'] = "^19.0.0";
}

// Update devDependencies too (for local testing)
if (pkg.devDependencies) {
  if (pkg.devDependencies.react) pkg.devDependencies.react = "^19.0.0";
  if (pkg.devDependencies['react-dom']) pkg.devDependencies['react-dom'] = "^19.0.0";
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("package.json updated to React 19!");


// This script can be run before deployment to update version.json
const fs = require('fs');
const path = require('path');

// Get version from package.json or use timestamp
const packagePath = path.join(__dirname, '..', 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageData.version || '1.0.0';

// Create version data
const versionData = {
  version: `${version}-${Date.now().toString(36)}`, // Add timestamp hash to force updates
  buildTime: new Date().toISOString()
};

// Path to version.json in public directory
const versionPath = path.join(__dirname, '..', 'public', 'version.json');

// Write updated version info
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

console.log(`✅ Updated version.json to ${versionData.version} (${versionData.buildTime})`);

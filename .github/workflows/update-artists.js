const fs = require('fs');
const path = require('path');

const updatePortfolio = (configPath) => {
  const configDir = path.dirname(configPath);
  const configContent = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  const portfolioKey = configContent[configDir];
  if (!portfolioKey) {
    console.log(`No portfolio key found for directory ${configDir}. Skipping.`);
    return;
  }

  const portfolioArray = portfolioKey.map((portfolioItem) => {
    return {
      portfolioLINK: configDir,
      ...portfolioItem,
    };
  });

  const updatedPortfolio = {
    [configDir]: portfolioArray,
  };

  const configFile = path.join(__dirname, 'path', configPath);
  const originalContent = JSON.parse(fs.readFileSync(configFile, 'utf8'));

  const updatedContent = { ...originalContent, ...updatedPortfolio };

  fs.writeFileSync(configFile, JSON.stringify(updatedContent, null, 2));

  console.log(`Portfolio updated for directory ${configDir}.`);
};

const configFiles = fs.readdirSync('a', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join('a', entry.name, 'config.json'));

configFiles.forEach((configPath) => {
  updatePortfolio(configPath);
});

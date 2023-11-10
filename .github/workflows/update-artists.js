const fs = require('fs');
const path = require('path');

const updatePortfolio = (configPath) => {
  const artistName = configPath.replace("a/", "")
  const configDir = path.join(configPath, "config.json");
  const configContent = JSON.parse(fs.readFileSync(configDir, 'utf8'));

  try {
    const directories = fs.readdirSync("./", { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  
    console.log('List of directories:', directories);
  } catch (err) {
    console.error('Error reading directories:', err);
  }
    
  const portfolioKey = configContent[artistName];
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

const artists = fs.readdirSync('a', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
    .map((entry) => path.join('a', entry.name));

artists.forEach((artistPath) => {
  updatePortfolio(artistPath)
});

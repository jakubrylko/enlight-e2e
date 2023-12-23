import { defineConfig } from 'cypress';
import fs from 'fs-extra';
import path from 'path';

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve('cypress/config', `${file}.json`);
  if (!fs.existsSync(pathToConfigFile)) {
    console.log('No custom config file found');
    return {};
  }
  return fs.readJson(pathToConfigFile);
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const file = config.env.configFile || '';
      return getConfigurationByFile(file);
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx,feature}',
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: false,
    defaultCommandTimeout: 10000,
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
});

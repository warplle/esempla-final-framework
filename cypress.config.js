const { defineConfig } = require("cypress");

module.exports = defineConfig({

  viewportWidth: 1500,
  viewportHeight: 1500,
  e2e: {
    setupNodeEvents(on, config) {
    }
  },
});

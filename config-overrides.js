const path = require("path");

module.exports = function override(config) {
  // Alias papaparse to its unminified source so Babel doesn't choke on the
  // heavily minified bundle (which triggers "Maximum call stack size exceeded").
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  config.resolve.alias["papaparse"] = path.resolve(
    __dirname,
    "node_modules/papaparse/papaparse.js"
  );

  // The unminified papaparse.js has a conditional require('stream') for Node.
  // In the browser we don't need it, so provide an empty fallback.
  config.resolve.fallback = config.resolve.fallback || {};
  config.resolve.fallback.stream = false;

  return config;
};

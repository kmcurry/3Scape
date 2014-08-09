var configLoader = function (env) {
    var config = require('./config'),
        loadedConfig = config[env];

    console.log("Loaded the configuration for " + env);
    if (loadedConfig === undefined) {
        throw new Error("Unable to load the configuration '" + env + "'.");
    }

    return loadedConfig;
};

module.exports = configLoader;
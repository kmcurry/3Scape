/*jslint node: true*/
var fs = require('fs'),
    utilities = function (config) {

        var logger = require('./logger')(config),
            emailer = require('./emailer')(config, logger),
            fileSystem = {
                mkdir: function (path) {
                    try {
                        fs.mkdirSync(path);
                    } catch (e) {
                        if (e.code != 'EEXIST') throw e;
                    }
                }
            };

        return {
            logger: logger,
            emailer: emailer,
            fs: fileSystem
        };
    };

module.exports = utilities;

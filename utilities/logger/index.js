/*jslint node:true*/
var moment = require('moment'),
    _ = require('lodash');

function writeMessageToConsole(text) {
    var currentTime = moment().format("MM/DD/YYYY HH:mm:ss"),
        consoleText = "(" + currentTime + ") " + text;

    console.log(consoleText);
    return consoleText;
}

function debug(message) {
    if (!_.isString(message)) {
        return writeMessageToConsole("DEBUG - " + JSON.stringify(message));
    }
    return writeMessageToConsole("DEBUG - " + message);
}

function info(message) {
    if (!_.isString(message)) {
        return writeMessageToConsole("INFO - " + JSON.stringify(message));
    }
    return writeMessageToConsole("INFO - " + message);
}

function warning(message) {
    if (!_.isString(message)) {
        return writeMessageToConsole("WARN - " + JSON.stringify(message));
    }
    return writeMessageToConsole("WARN - " + message);
}

function error(message) {
    if (!_.isString(message)) {
        return writeMessageToConsole("ERROR - " + JSON.stringify(message));
    }
    return writeMessageToConsole("ERROR - " + message);
}

function empty() {}

function logger(config) {

    var loggerObject = {};
    loggerObject.debug = (config.log && config.log.debug) ? debug : empty;
    loggerObject.info = (config.log && config.log.info) ? info : empty;
    loggerObject.warning = (config.log && config.log.warning) ? warning : empty;
    loggerObject.error = (config.log && config.log.error) ? error : empty;

    return loggerObject;
}

module.exports = logger;
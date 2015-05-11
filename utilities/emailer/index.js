/*jslint node: true*/
var handlebars = require('handlebars'),
  path = require('path'),
  fs = require('fs'),
  q = require('q'),
  sendgrid = require('sendgrid'),
  cachedTemplates = {};

function send(sendOptions) {
  var sendgridInstance = require('sendgrid')(this.config.smtpUser, this.config.smtpPass),
    emailParameters = {
      to: sendOptions.to,
      cc: this.config.ccAddress,
      fromName: this.config.fromName,
      from: this.config.fromAddress,
      subject: " ",
      html: "<html/>"
    },
    email = new sendgridInstance.Email(emailParameters),
    context = this;

    email.addSubstitution("-tempPass-", sendOptions.tempPass)

    email.addFilter("templates", "enable", 1);
    email.addFilter("templates", "template_id", sendOptions.templateId)

    // TODO: generalize to sendOptions.substitutions
    if (sendOptions.tokenUrl) {
      console.log("tokenUrl: " + sendOptions.tokenUrl)
      email.addSubstitution("tokenUrl", sendOptions.tokenUrl);
    }

  sendgridInstance.send(email, function(err, json) {
    if (err) {
      console.log(err);
      context.logger.debug(json);
    } else {
      context.logger.debug("Email sent: ", json);
    }
  });
}

function emailer(config, logger) {
  var emailerContext = {
      config: config.email,
      logger: logger
    },
    sendBound = send.bind(emailerContext),
    emailerObject = {
      send: sendBound,
    };

  if (!emailerContext.config) {
    logger.warning("No email options available");
  }

  return emailerObject;
}

module.exports = emailer;

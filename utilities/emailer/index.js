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
      subject: sendOptions.subject,
      html: sendOptions.body
    },
    email = new sendgridInstance.Email(emailParameters),
    context = this;

  sendgridInstance.send(email, function(err, json) {
    if (err) {
      console.log(err);
      context.logger.debug(json);
    } else {
      context.logger.debug("Email sent: ", json);
    }
  });
}

function sendTemplate(sendOptions, templateName, data) {
  var defer = q.defer(),
    context = this;

  if (!sendOptions) {
    this.logger.error("Send options are not available");
  }
  if (!templateName) {
    this.logger.error("No template name provided.");
  }
  if (!data) {
    data = {};
  }

  function renderAndSend(compiled) {
    var result = compiled(data);
    sendOptions.body = result;

    (send.bind(context))(sendOptions);
  }

  if (cachedTemplates[templateName]) {
    renderAndSend(cachedTemplates[templateName].compiled);
    defer.resolve();
    return;
  }

  var filename = templateName + ".hbs",
    templatePath = path.join(__dirname, "/templates"),
    fullFilePath = path.join(templatePath, filename);

  fs.readFile(fullFilePath, {
    encoding: 'utf8'
  }, function(fileReadError, fileData) {
    if (fileReadError) {
      this.logger.error(fileReadError);
      defer.reject();
    } else {
      var compiled = handlebars.compile(fileData);
      cachedTemplates[templateName] = {
        compiled: compiled,
        raw: fileData
      };

      renderAndSend(compiled);
      defer.resolve();
    }
  });

  return defer.promise;
}

function emailer(config, logger) {
  var emailerContext = {
      config: config.email,
      logger: logger
    },
    sendTemplateBound = sendTemplate.bind(emailerContext),
    sendBound = send.bind(emailerContext),
    emailerObject = {
      send: sendBound,
      sendTemplate: sendTemplateBound
    };

  if (!emailerContext.config) {
    logger.warning("No email options available");
  }

  return emailerObject;
}

module.exports = emailer;

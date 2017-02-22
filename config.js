var path = require('path'),
    configuration = {
        production: {
            dbConnectionString: process.env.MONGODB_URI,
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,
            email: {
              smtpService: "SendGrid",
              smtpUser: '3Scape',
              smtpPass: process.env.emailSmtpPass,
              fromName: "3Scape",
              fromAddress: "kevin@3Scape.me",
              ccAddress: "admin@3Scape.me",
              forgot: "10a82d11-f620-4a62-9298-a487cbd1f288",
              reset: "b719e3e4-3e13-40b8-87a0-d69af392fffc",
              welcome: "04e2331d-f214-4ddb-8a82-1c82ced28506"
            },
            log: {
              debug: false,
              info: false,
              warning: true,
              error: true
            },
            payment: {
              pubKey: process.env.paymentPubKey,
              secKey: process.env.paymentSecKey,
              plan: "Subscriber-Launch",
              couponVSTE: "VSTE-CONFERENCE"
            }
        },
        qa: {
            dbConnectionString: process.env.MONGODB_URI,
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,
            email: {
              smtpService: "SendGrid",
              smtpUser: '3Scape',
              smtpPass: process.env.emailSmtpPass,
              fromName: "3Scape QA",
              fromAddress: "kevin@3Scape.me",
              ccAddress: "admin@3Scape.me",
              forgot: "10a82d11-f620-4a62-9298-a487cbd1f288",
              reset: "b719e3e4-3e13-40b8-87a0-d69af392fffc",
              welcome: "04e2331d-f214-4ddb-8a82-1c82ced28506"
            },
            log: {
              debug: true,
              info: true,
              warning: true,
              error: true
            },
            payment: {
              pubKey: process.env.paymentPubKey,
              secKey: process.env.paymentSecKey,
              plan: "Subscriber-Annual-15"
            }
        },
        local: {
            dbConnectionString: "mongodb://127.0.0.1/3Scape_dev",
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,
            email: {
              smtpService: "SendGrid",
              smtpUser: '3Scape',
              smtpPass: process.env.emailSmtpPass,
              fromName: "3Scape Dev",
              fromAddress: "kevin@3Scape.me",
              ccAddress: "admin@3Scape.me",
              forgot: "10a82d11-f620-4a62-9298-a487cbd1f288",
              reset: "b719e3e4-3e13-40b8-87a0-d69af392fffc",
              welcome: "04e2331d-f214-4ddb-8a82-1c82ced28506"
            },
            log: {
              debug: true,
              info: true,
              warning: true,
              error: true
            },
            payment: {
              pubKey: process.env.paymentPubKey,
              secKey: process.env.paymentSecKey,
              plan: "Subscriber-Annual-15"
            }
        },
    };

module.exports = configuration;

var path = require('path'),
    configuration = {
        production: {
            dbConnectionString: 'mongodb://heroku_mrc0vdg8:dh4p3kdl81jd7flthrdagmgc7f@ds145178.mlab.com:45178/heroku_mrc0vdg8',
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,
            email: {
              smtpService: "SendGrid",
              smtpUser: '3Scape',
              smtpPass: '8<bHm9kQ$|l\':UQ?',
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
              pubKey: 'pk_live_pg4HE0muQMAWKx9SHoXaKaQw',
              secKey: 'sk_live_2Q9R1p0U0KN6KzuyKEEl3Qn2',
              plan: "Subscriber-Launch",
              couponVSTE: "VSTE-CONFERENCE"
            }
        },
        qa: {
            dbConnectionString: 'mongodb://3QA:5d4b7d67325f227761473a2866@novus.modulusmongo.net:27017/asix2Odo',
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,
            email: {
              smtpService: "SendGrid",
              smtpUser: '3Scape',
              smtpPass: '8<bHm9kQ$|l\':UQ?',
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
              pubKey: 'pk_test_3MnIIPctq6FSKqodwe6iXm5U',
              secKey: 'sk_test_gilKHGlFzeRA0lFhoXdY8oIk',
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
              smtpPass: '8<bHm9kQ$|l\':UQ?',
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
              pubKey: "pk_test_3MnIIPctq6FSKqodwe6iXm5U",
              secKey: "sk_test_gilKHGlFzeRA0lFhoXdY8oIk",
              plan: "Subscriber-Annual-15"
            }
        },
    };

module.exports = configuration;

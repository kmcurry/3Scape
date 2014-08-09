var path = require('path'),
    configuration = {
        qa: {
            dbConnectionString: 'mongodb://3QA:5d4b7d67325f227761473a2866@novus.modulusmongo.net:27017/asix2Odo',
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,
        },
        local: {
            dbConnectionString: "mongodb://127.0.0.1/3Scape_dev",
            publicPath: path.resolve("./public"),
            viewPath: path.resolve('./views'),
            port: process.env.PORT || 8080,            
        },
        // prod: {
        //     dbConnectionString: "TBD",
        //     publicPath: path.resolve("./public"),
        //     viewPath: path.resolve('./views'),
        //     port: process.env.PORT || 8080,
        // },
    };

module.exports = configuration;
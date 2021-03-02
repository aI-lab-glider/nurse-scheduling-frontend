const waitOn = require('wait-on');
const env = require("dotenv").config().parsed;
const opts = {
    resources: [
        `http://localhost:${env.PORT}`,
    ],
};
waitOn(opts, function (err) {
    if (err) {
        return errorExit(err);
    }
    process.exit(0);
});
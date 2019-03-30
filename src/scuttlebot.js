/*
easy-ssb-pub: an easy way to deploy a Secure Scuttlebutt Pub.

Copyright (C) 2017 Andre 'Staltz' Medeiros (staltz.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var ssbClient = require("scuttlebot");
var minimist = require("minimist");
var ssbKeys = require("ssb-keys");
var confInject = require("ssb-config/inject");
var path = require("path");
var config_1 = require("./config");
var fs = require("fs");
/**
 * Sets up and runs a Scuttlebot.
 * @param {Options} opts
 */
function setupScuttlebot() {
    var argv = process.argv.slice(2);
    var i = argv.indexOf('--');
    var conf = argv.slice(i + 1);
    argv = ~i ? argv.slice(0, i) : argv;
    var ssbConf = confInject(process.env.ssb_appname, minimist(conf));
    ssbConf.path = "./docker_volumes/ssb_data_stored_here"
    ssbConf.keys = ssbKeys.loadOrCreateSync(path.join(ssbConf.path, 'secret'));
    ssbConf.port = config_1.SBOT_PORT;
    ssbConf.swarm = { port: 8007, maxPeers: 3 };
    var createSbot = ssbClient
        .use(require('scuttlebot/plugins/plugins'))
        .use(require('scuttlebot/plugins/master'))
        .use(require('scuttlebot/plugins/gossip'))
        .use(require('scuttlebot/plugins/replicate'))
        .use(require('ssb-friends'))
        .use(require('ssb-blobs'))
        .use(require('scuttlebot/plugins/invite'))
        .use(require('scuttlebot/plugins/local'))
        .use(require('scuttlebot/plugins/logging'))
        .use(require('ssb-query'))
        .use(require('ssb-links'))
        .use(require('ssb-ws'))
        .use(require('ssb-ebt'))
        //.use(require('ssb-discovery-swarm'))
        .use(require('ssb-autoname'));
    var ssbBot = createSbot(ssbConf);
    var manifestFile = path.join(ssbConf.path, 'manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify(ssbBot.getManifest(), null, 2));
    ssbBot.conf = ssbConf;
    ssbBot.address(function (err, addr) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        else {
            config_1.debug('Scuttlebot app is running on address %s', addr);
        }
    });
    return { ssbBot: ssbBot, ssbConf: ssbConf };
}
exports.setupScuttlebot = setupScuttlebot;

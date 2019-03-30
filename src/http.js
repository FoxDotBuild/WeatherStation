"use strict";
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

var express = require("express");
var qr = require("qr-image");
var config_1 = require("./config");
var pull = require("pull-stream");
var makeServeViewer = require("./viewer/index");
function reportIfError(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
}
function createInvite(sbot, n) {
    return function readInvite(end, cb) {
        if (end === true) {
            return;
        }
        if (end) {
            return cb(end);
        }
        sbot.invite.create(n, cb);
    };
}
/**
 * Sets up and runs an Express HTTP/HTML server.
 * @param {Options} opts
 */
function setupExpressApp(opts) {
    var port = opts.port || config_1.HTTP_PORT;
    var app = express();
    app.use(express.static(__dirname + '/public'));
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.set('port', port);
    app.set('views', __dirname + '/../pages');
    app.set('view engine', 'ejs');
    var idQR = qr.svgObject(opts.bot.id);
    var serveViewer = makeServeViewer(opts.bot, { viewer: { base: '/view/' } });
    app.get('/', function (req, res) {
        res.render('index', {
            id: opts.bot.id,
            qrSize: idQR.size,
            qrPath: idQR.path,
        });
    });
    app.get('/invited', function (req, res) {
        pull(createInvite(opts.bot, 1), pull.take(1), pull.drain(function (invitation) {
            var qrCode = qr.svgObject(invitation);
            res.render('invited', {
                invitation: invitation,
                qrSize: qrCode.size,
                qrPath: qrCode.path,
            });
        }, reportIfError));
    });
    app.get('/view/*', serveViewer);
    return app.listen(app.get('port'), function () {
        config_1.debug('Express app is running on port %s', app.get('port'));
    });
}
exports.setupExpressApp = setupExpressApp;

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

var scuttlebot_1 = require("./scuttlebot");
var http_1 = require("./http");
var ssbBot = scuttlebot_1.setupScuttlebot().ssbBot;
http_1.setupExpressApp({ bot: ssbBot });

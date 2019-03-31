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
var ssbBot = scuttlebot_1.setupScuttlebot().ssbBot;

getWeather = require("./weather");

function doit() {
  console.log("Getting weather");

  getWeather()
    .then(function (report) {
      ssbBot.publish({
        type: 'post',
        text: `${report[0]}% relative humidity. Heat index is ${report[1]} deg F`
      }, function () {
        console.log("Done...");
      });
    }).catch(function (error) {
      console.log("OH NOES");
      console.dir(error);
    });

}
var ONE_HOUR = 1000 * 60 * 60;

setInterval(doit, ONE_HOUR);

doit();


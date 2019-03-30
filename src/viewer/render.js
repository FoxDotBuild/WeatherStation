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
var path = require('path');
var pull = require("pull-stream");
var marked = require("ssb-marked");
var htime = require("human-time");
var emojis = require("emoji-named-characters");
var cat = require("pull-cat");
var emojiDir = path.join(require.resolve("emoji-named-characters"), "../pngs");
exports.wrapPage = wrapPage;
exports.MdRenderer = MdRenderer;
exports.renderEmoji = renderEmoji;
exports.formatMsgs = formatMsgs;
exports.renderThread = renderThread;
function MdRenderer(opts) {
    marked.Renderer.call(this, {});
    this.opts = opts;
}
MdRenderer.prototype = new marked.Renderer();
MdRenderer.prototype.urltransform = function (href) {
    if (!href)
        return false;
    switch (href[0]) {
        case "#":
            return this.opts.base + "channel/" + href.slice(1);
        case "%":
            return this.opts.msg_base + encodeURIComponent(href);
        case "@":
            return this.opts.feed_base + encodeURIComponent(href);
        case "&":
            return this.opts.blob_base + encodeURIComponent(href);
    }
    if (href.indexOf("javascript:") === 0)
        return false;
    return href;
};
MdRenderer.prototype.image = function (href, title, text) {
    return ('<img src="' +
        this.opts.img_base +
        escape(href) +
        '"' +
        ' alt="' +
        text +
        '"' +
        (title ? ' title="' + title + '"' : "") +
        (this.options.xhtml ? "/>" : ">"));
};
function renderEmoji(emoji) {
    var opts = this.renderer.opts;
    return emoji in emojis
        ? '<img src="' +
        opts.emoji_base +
        escape(emoji) +
        '.png"' +
        ' alt=":' +
        escape(emoji) +
        ':"' +
        ' title=":' +
        escape(emoji) +
        ':"' +
        ' class="ssb-emoji" height="16" width="16">'
        : ":" + emoji + ":";
}
function escape(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
function formatMsgs(id, ext, opts) {
    switch (ext || "html") {
        case "html":
            return pull(renderThread(opts), wrapPage(id));
        case "js":
            return pull(renderThread(opts), wrapJSEmbed(opts));
        case "json":
            return wrapJSON();
        default:
            return null;
    }
}
function wrap(before, after) {
    return function (read) {
        return cat([pull.once(before), read, pull.once(after)]);
    };
}
function renderThread(opts) {
    return pull(pull.map(renderMsg.bind(this, opts)), wrap('<span class="top-tip">You are reading content from ' +
        '<a href="https://www.scuttlebutt.nz">Scuttlebutt</a>' +
        '</span>' +
        '<main>', '</main>' +
        '<a class="call-to-action" href="https://www.scuttlebutt.nz">' +
        'Join Scuttlebutt now' +
        '</a>'));
}
function wrapPage(id) {
    return wrap("<!doctype html><html><head>" +
        "<meta charset=utf-8>" +
        "<title>Scuttlebutt content: " +
        id +
        "</title>" +
        '<meta name=viewport content="width=device-width,initial-scale=1">' +
        styles +
        "</head><body>", "</body></html>");
}
var styles = "\n  <style>\n    html { background-color: #f1f3f5; }\n    body {\n      color: #212529;\n      font-family: \"Helvetica Neue\", \"Calibri Light\", Roboto, sans-serif;\n      -webkit-font-smoothing: antialiased;\n      -moz-osx-font-smoothing: grayscale;\n      letter-spacing: 0.02em;\n      padding-top: 30px;\n      padding-bottom: 50px;\n    }\n    a { color: #364fc7; }\n\n    .top-tip, .top-tip a {\n      color: #868e96;\n    }\n    .top-tip {\n      text-align: center;\n      display: block;\n      margin-bottom: 10px;\n      font-size: 14px;\n    }\n    main { margin: 0 auto; max-width: 40rem; }\n    main article:first-child { border-radius: 3px 3px 0 0; }\n    main article:last-child { border-radius: 0 0 3px 3px; }\n    article {\n      background-color: white;\n      padding: 20px;\n      box-shadow: 0 1px 3px #949494;\n      position: relative;\n    }\n    .top-right { position: absolute; top: 20px; right: 20px; }\n    article > header { margin-bottom: 20px; }\n    article > header > figure {\n      margin: 0; display: flex;\n    }\n    article > header > figure > img {\n      border-radius: 2px; margin-right: 10px;\n    }\n    article > header > figure > figcaption {\n      display: flex; flex-direction: column; justify-content: space-around;\n    }\n    .ssb-avatar-name { font-size: 1.2em; font-weight: bold; }\n    time a { color: #868e96; }\n    .ssb-avatar-name, time a {\n      text-decoration: none;\n    }\n    .ssb-avatar-name:hover, time:hover a {\n      text-decoration: underline;\n    }\n    section p { line-height: 1.45em; }\n    section p img {\n      max-width: 100%;\n      max-height: 50vh;\n      margin: 0 auto;\n    }\n    .status {\n      font-style: italic;\n    }\n\n    code {\n      display: inline;\n      padding: 2px 5px;\n      font-weight: 600;\n      background-color: #e9ecef;\n      border-radius: 3px;\n      color: #495057;\n    }\n    blockquote {\n      padding-left: 1.2em;\n      margin: 0;\n      color: #868e96;\n      border-left: 5px solid #ced4da;\n    }\n    pre {\n      background-color: #212529;\n      color: #ced4da;\n      font-weight: bold;\n      padding: 5px;\n      border-radius: 3px;\n      position: relative;\n    }\n    pre::before {\n      content: \"METADATA\";\n      position: absolute;\n      top: -7px;\n      left: 0px;\n      background-color: #212529;\n      padding: 2px 4px 0;\n      border-radius: 2px;\n      font-family: \"Helvetica Neue\", \"Calibri Light\", Roboto, sans-serif;\n      font-size: 9px;\n    }\n    .call-to-action {\n      display: block;\n      margin: 0 auto;\n      width: 13em;\n      text-align: center;\n      text-decoration: none;\n      margin-top: 20px;\n      margin-bottom: 60px;\n      background-color: #5c7cfa;\n      padding: 15px 0;\n      color: #edf2ff;\n      border-radius: 3px;\n      border-bottom: 3px solid #3b5bdb;\n    }\n    .call-to-action:hover {\n      background-color: #748ffc;\n      border-bottom: 3px solid #4c6ef5;\n    }\n  </style>\n";
function wrapJSON() {
    var first = true;
    return pull(pull.map(JSON.stringify), join(","), wrap("[", "]"));
}
function wrapJSEmbed(opts) {
    return pull(wrap('<link rel=stylesheet href="' + opts.base + 'static/base.css">', ""), pull.map(docWrite), opts.base_token && rewriteBase(new RegExp(opts.base_token, "g")));
}
function rewriteBase(token) {
    // detect the origin of the script and rewrite the js/html to use it
    return pull(replace(token, '" + SSB_VIEWER_ORIGIN + "/'), wrap("var SSB_VIEWER_ORIGIN = (function () {" +
        'var scripts = document.getElementsByTagName("script")\n' +
        "var script = scripts[scripts.length-1]\n" +
        "if (!script) return location.origin\n" +
        'return script.src.replace(/\\/%.*$/, "")\n' +
        "}())\n", ""));
}
function join(delim) {
    var first = true;
    return pull.map(function (val) {
        if (!first)
            return delim + String(val);
        first = false;
        return val;
    });
}
function replace(re, rep) {
    return pull.map(function (val) {
        return String(val).replace(re, rep);
    });
}
function docWrite(str) {
    return "document.write(" + JSON.stringify(str) + ")\n";
}
function renderMsg(opts, msg) {
    var c = msg.value.content || {};
    var name = encodeURIComponent(msg.key);
    return ('<article id="' +
        name +
        '">' +
        '<header>' +
        '<figure>' +
        '<img alt="" ' +
        'src="' + opts.img_base + escape(msg.author.image) + '" ' +
        'height="50" width="50">' +
        '<figcaption>' +
        '<a class="ssb-avatar-name"' +
        ' href="' + opts.base +
        escape(msg.value.author) +
        '"' +
        ">" + msg.author.name + "</a>" +
        msgTimestamp(msg, name) +
        '</figcaption>' +
        '</figure>' +
        '</header>' +
        render(opts, c) +
        "</article>");
}
function msgTimestamp(msg, name) {
    var date = new Date(msg.value.timestamp);
    var isoStr = date.toISOString();
    return ('<time class="ssb-timestamp" datetime="' + isoStr + '">' +
        '<a ' +
        'href="#' + name + '" ' +
        'title="' + isoStr + '" ' +
        '>' + formatDate(date) + '</a>' +
        '</time>');
}
function formatDate(date) {
    // return date.toISOString().replace('T', ' ')
    return htime(date);
}
function render(opts, c) {
    var base = opts.base;
    if (c.type === "post") {
        var channel = c.channel
            ? '<div class="top-right"><a href="' + base + 'channel/' + c.channel + '">#' + c.channel + "</a></div>"
            : "";
        return channel + renderPost(opts, c);
    }
    else if (c.type == "vote" && c.vote.expression == "Dig") {
        var channel = c.channel
            ? ' in <a href="' + base + 'channel/' + c.channel + '">#' + c.channel + "</a>"
            : "";
        var linkedText = "this";
        if (typeof c.vote.linkedText != "undefined")
            linkedText = c.vote.linkedText.substring(0, 75);
        return ('<span class="status">' +
            'Liked ' +
            '<a href="' + base +
            c.vote.link +
            '">' +
            linkedText +
            "</a>" +
            channel +
            '</span>');
    }
    else if (c.type == "vote") {
        var linkedText = "this";
        if (typeof c.vote.linkedText != "undefined")
            linkedText = c.vote.linkedText.substring(0, 75);
        return '<span class="status">' +
            'Voted <a href="' + base + c.vote.link + '">' + linkedText + "</a>" +
            '</span>';
    }
    else if (c.type == "contact" && c.following) {
        var name = c.contact;
        if (typeof c.contactAbout != "undefined")
            name = c.contactAbout.name;
        return '<span class="status">' +
            'Followed <a href="' + base + c.contact + '">' + name + "</a>" +
            '</span>';
    }
    else if (c.type == "contact" && !c.following) {
        var name = c.contact;
        if (typeof c.contactAbout != "undefined")
            name = c.contactAbout.name;
        return '<span class="status">' +
            'Unfollowed <a href="' + base + c.contact + '">' + name + "</a>" +
            '</span>';
    }
    else if (typeof c == "string") {
        return '<span class="status">' +
            "Wrote something private" +
            '</span>';
    }
    else if (c.type == "about") {
        return '<span class="status">' +
            "Changed something in about" +
            '</span>' +
            renderDefault(c);
    }
    else if (c.type == "issue") {
        return '<span class="status">' +
            "Created a git issue" +
            '</span>' +
            renderDefault(c);
    }
    else if (c.type == "git-update") {
        return '<span class="status">' +
            "Did a git update" +
            '</span>' +
            renderDefault(c);
    }
    else if (c.type == "ssb-dns") {
        return '<span class="status">' +
            "Updated DNS" +
            '</span>' +
            renderDefault(c);
    }
    else if (c.type == "pub") {
        return '<span class="status">' +
            "Connected to a pub" +
            '</span>' +
            renderDefault(c);
    }
    else if (c.type == "channel" && c.subscribed)
        return '<span class="status">' +
            'Subscribed to channel <a href="' + base + 'channel/' +
            c.channel +
            '">#' +
            c.channel +
            "</a>" +
            '</span>';
    else if (c.type == "channel" && !c.subscribed)
        return '<span class="status">' +
            'Unsubscribed from channel <a href="' + base + 'channel/' +
            c.channel +
            '">#' +
            c.channel +
            "</a>" +
            '</span>';
    else
        return renderDefault(c);
}
function renderPost(opts, c) {
    return '<section>' + marked(c.text, opts.marked) + "</section>";
}
function renderDefault(c) {
    return "<pre>" + JSON.stringify(c, 0, 2) + "</pre>";
}

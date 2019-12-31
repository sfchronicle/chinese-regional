#!/usr/bin/env node

var { google } = require("googleapis");
var async = require("async");
var os = require("os");
var url = require('url');
var path = require("path");
var writeFile = require('write');
var { authenticate } = require("./googleauth");
var config = require('../project.json');
var archieml = require('archieml');
var htmlparser = require('htmlparser2');
var Entities = require('html-entities').AllHtmlEntities;

var auth = null;
try {
  auth = authenticate();
} catch (err) {
  console.log(err);
}

// var done = this.async();

var drive = google.drive({
  auth,
  version: "v3"
});

/*
 * Large document sets may hit rate limits; you can find details on your quota at:
 * https://console.developers.google.com/apis/api/drive.googleapis.com/quotas?project=<project>
 * where <project> is the project you authenticated with using `grunt google-auth`
 */
async.eachLimit(
  config.docsID,
  2, // adjust this up or down based on rate limiting
  async function(fileId) {

    drive.files.export({ fileId: fileId, mimeType: 'text/html', fields: "items(title)"}, function (err, docHtml) {
     
      var handler = new htmlparser.DomHandler(function (error, dom) {
        var tagHandlers = {
          _base: function (tag) {
            var str = '';
            tag.children.forEach(function (child) {
              if (func = tagHandlers[child.name || child.type]) str += func(child);
            });
            return str;
          },
          text: function (textTag) {
            return textTag.data;
          },
          span: function (spanTag) {
            return tagHandlers._base(spanTag);
          },
          p: function (pTag) {
            return tagHandlers._base(pTag) + '\n';
          },
          a: function (aTag) {
            var href = aTag.attribs.href;
            if (href === undefined) return '';

            // extract real URLs from Google's tracking
            // from: http://www.google.com/url?q=http%3A%2F%2Fwww.sfchronicle.com...
            // to: http://www.sfchronicle.com...
            if (aTag.attribs.href && url.parse(aTag.attribs.href, true).query && url.parse(aTag.attribs.href, true).query.q) {
              href = url.parse(aTag.attribs.href, true).query.q;
            }

            var str = '<a href="' + href + '">';
            str += tagHandlers._base(aTag);
            str += '</a>';
            return str;
          },
          li: function (tag) {
            return '* ' + tagHandlers._base(tag) + '\n';
          }
        };

        ['ul', 'ol'].forEach(function (tag) {
            tagHandlers[tag] = tagHandlers.span;
        });
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function (tag) {
            tagHandlers[tag] = tagHandlers.p;
        });
        var body = dom[0].children[1];
        var parsedText = tagHandlers._base(body);

        // Convert html entities into the characters as they exist in the google doc
        var entities = new Entities();
        parsedText = entities.decode(parsedText);

        // Remove smart quotes from inside tags
        parsedText = parsedText.replace(/<[^<>]*>/g, function (match) {
          return match.replace(/”|“/g, '"').replace(/‘|’/g, "'");
        });
  
        // Parse with Archie
        var parsed = archieml.load(parsedText);

        // Create the file
        var filename = "data/"+fileId+"_project_data.json";
        writeFile(filename, JSON.stringify(parsed, null, 2));
      });

      var parser = new htmlparser.Parser(handler);
      parser.write(docHtml.data);
      parser.done(); 

      console.log("\x1b[32m", "project_data.json created successfully")     
    });
  },
);

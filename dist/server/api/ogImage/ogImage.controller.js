/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';


var ogs = require('open-graph-scraper');

// retrieves data from facebook meta tags on the url (og tags)
exports.findOgMetadata = function(req, res) {
  var url = req.body.url;
  console.log(url);
  var options = {'url': url, 'timeout': 8000};
  ogs(options, function (err, results) {
    if(err) {
      console.log(err);
      console.log(results);
      return res.status(500).send('No Content');
    }
    return res.status(200).json(results);
  });
};


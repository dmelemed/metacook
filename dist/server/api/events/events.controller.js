'use strict';

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var gcalAuth = require('../../google-calendar-quickstart');

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Recipes              ->  index
 * POST    /Recipes              ->  create
 * GET     /Recipes/:id          ->  show
 * PUT     /Recipes/:id          ->  update
 * DELETE  /Recipes/:id          ->  destroy
 */

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
exports.index = function(req, res) {
    var calendarId = req.params.calendarId;
    console.log('Received request for calendar events for calendarId', calendarId);
    // console.log('Received request for calendar events (primary calendar as default');

    function listEvents(auth) {
        var maxResults = req.query.limit;
        if (maxResults == null) {
            maxResults = 100;
        }
        var calendar = google.calendar('v3');
        // var auth = gcalAuth.getAuth();
        calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: (new Date()).toISOString(),
            maxResults: maxResults,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                res.status(500).send('The API returned an error ' + err);
                return;
            }
            console.log('Retrieved events from Google', response);
            var events = response.items;
            res.json(events);
        });
    }

    gcalAuth.authorize(listEvents);
};

exports.show = function(req, res) {
    var calendarId = req.params.calendarId;
    console.log('Received request for calendar events for calendarId', calendarId);

    function listEvents(auth) {
        var maxResults = req.query.limit;
        if (maxResults == null) {
            maxResults = 100;
        }
        var calendar = google.calendar('v3');
        // var auth = gcalAuth.getAuth();
        calendar.events.list({
            auth: auth,
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            maxResults: maxResults,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                res.status(500).send('The API returned an error ' + err);
                return;
            }
            console.log('Retrieved events from Google', response);
            var events = response.items;
            res.json(events);
        });
    }

    gcalAuth.authorize(listEvents);
};

// Get a single Recipe
exports.show = function(req, res) {
    Recipe.findById(req.params.id, function(err, Recipe) {
        if (err) {
            return handleError(res, err);
        }
        if (!Recipe) {
            return res.status(404).send('Not Found');
        }
        return res.json(Recipe);
    });
};

exports.create = function(req, res) {

    var calendarId = req.params.calendarId;
    console.log('Received request to create new calendar event in calendarId', calendarId, req.body);

    function insertEvent(auth) {

        var body = req.body;

        var event = {
            summary: body.summary,
            location: body.location,
            description: body.description,
            start: {
                dateTime: body.startDateTime,
                timeZome: 'America/New_York'
            },
            end: {
                dateTime: body.endDateTime,
                timeZome: 'America/New_York'
            }
        };

        var calendar = google.calendar('v3');
        calendar.events.insert({
            auth: auth,
            calendarId: req.params.calendarId,
            resource: event,
        }, function(err, event) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                res.status(500).send('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created: %s', event.htmlLink);
            res.json(event);
        });
    }

    gcalAuth.authorize(insertEvent);
};

// Updates an existing Recipe in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Recipe.findById(req.params.id, function(err, Recipe) {
        if (err) {
            return handleError(res, err);
        }
        if (!Recipe) {
            return res.status(404).send('Not Found');
        }
        var updated = _.merge(Recipe, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(Recipe);
        });
    });
};

// Deletes a Recipe from the DB.
exports.destroy = function(req, res) {
    Recipe.findById(req.params.id, function(err, Recipe) {
        if (err) {
            return handleError(res, err);
        }
        if (!Recipe) {
            return res.status(404).send('Not Found');
        }
        Recipe.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}

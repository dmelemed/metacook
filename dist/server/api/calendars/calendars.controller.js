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

    console.log('Received request for calendars');

    function listCalendars(auth) {

        var body = req.body;

        var calendarResource = {
            calendarId: 'primary',
            timeZone: 'America/New_York',
            summary: body.name
        };

        var calendar = google.calendar('v3');
        console.log(calendar.calendarList);
        calendar.calendarList.list({
            auth: auth
        }, function(err, response) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                res.status(500).send('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Calendars:', response);
            var calendars = response.items;
            console.log('Event created: %s', calendars);
            res.json(calendars);
        });
    }

    gcalAuth.authorize(listCalendars);

};

// Get a single Recipe
exports.show = function(req, res) {

};

// Creates a new Recipe in the DB.
exports.create = function(req, res) {

    console.log('Received request to create new calendar event');

    function insertEvent(auth) {

        var body = req.body;

        var calendarResource = {
            calendarId: 'primary',
            timeZone: 'America/New_York',
            summary: body.name
        };

        var calendar = google.calendar('v3');
        console.log(calendar);
        calendar.calendars.insert({
            auth: auth,
            resource: calendarResource
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

exports.update = function(req, res) {

};

exports.destroy = function(req, res) {

};

exports.colors = function(req, res) {

    console.log('Received request for calendar and event colors');

    function getColors(auth) {
        var calendar = google.calendar('v3');
        calendar.colors.get({
            auth: auth
        }, function(err, response) {
            if (err) {
                console.log('There was an error contacting the Calendar service for colors: ' + err);
                res.status(500).send('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Google calendar colors:', response);
            res.json(response);
        });
    }

    gcalAuth.authorize(getColors);
};

function handleError(res, err) {
    return res.status(500).send(err);
}

'use strict';

angular.module('metacookApp')
    .controller('EventsController', function($scope, $http, $q, $mdpTimePicker, $mdpDatePicker) {
        $scope.browseBy = ['Inbox', 'Today', 'Next 7 days'];
        $scope.events = [];
        $scope.calendars = [];
        $scope.calendarId = null;
        $scope.durations = [{
            "durationInMinutes": 5,
            "display": "5 minutes"
        }, {
            "durationInMinutes": 10,
            "display": "10 minutes"
        }, {
            "durationInMinutes": 15,
            "display": "15 minutes"
        }, {
            "durationInMinutes": 30,
            "display": "30 minutes"
        }, {
            "durationInMinutes": 45,
            "display": "45 minutes"
        }, {
            "durationInMinutes": 60,
            "display": "1 hour"
        }, {
            "durationInMinutes": 90,
            "display": "1.5 hours"
        }, {
            "durationInMinutes": 120,
            "display": "2 hours"
        }, {
            "durationInMinutes": 180,
            "display": "3 hours"
        }];

        //////////////////////////////////////////////////////////////////////////////////////
        // LOAD DATA
        //////////////////////////////////////////////////////////////////////////////////////

        loadAllEvents();
        loadColorPalette();
        loadCalendarMap();

        //////////////////////////////////////////////////////////////////////////////////////
        // CALENDARS
        //////////////////////////////////////////////////////////////////////////////////////

        // CREATE
        $scope.createNewCalendar = function(calendar) {
            $http.post('/api/calendars', calendar).then(function successCallback(response) {
                console.log('Created new calendar')
            }, function errorCallback(err) {
                console.log('Error when creating new calendar', err);
            });
        };

        // LIST
        function listCalendars() {
            return $http.get('/api/calendars').then(function successCallback(response) {
                var calendars = response.data;
                console.log('Retrieved list of all calendars', calendars);
                return calendars;
            }, function errorCallback(err, code) {
                console.log('Error when getting calendars from server', err);
            });
        }

        // MAP
        function loadCalendarMap() {
            var calendarsPromise = listCalendars();
            var calendarsMap = [];
            calendarsPromise.then(function mapCalendars(calendars) {
                calendars.forEach(function(calendar) {
                    calendarsMap[calendar.id] = calendar;
                });
                $scope.calendarsMap = calendarsMap;
                console.log('CalendarsMap', calendarsMap);
            });
        }

        //////////////////////////////////////////////////////////////////////////////////////
        // EVENTS
        //////////////////////////////////////////////////////////////////////////////////////

        // CREATE
        $scope.createEvent = function(event, calendarId) {
            console.log(calendarId);
            console.log('Creating new event at current time', event);
            var startDateTime = event.startDateTime;
            event.startDateTime = startDateTime.toISOString();
            var durationInMinutes = event.durationInMinutes;
            event.endDateTime = new Date(startDateTime.getTime() + durationInMinutes * 60000);
            // var calendarId = event.calendarId;
            $http.post('/api/calendars/' + calendarId + '/events', event).then(function successCallback(response) {
                console.log('Successfully added new event', event);
                $scope.calendarEvent = {};
                loadAllEvents();
            });
        };

        // CLEAR
        $scope.clearEvent = function() {
            $scope.calendarEvent = {
                startDateTime: new Date(Date.now())
            };
        };

        $scope.clearEvent();

        // LIST
        function getEvents(calendarId) {
            if (calendarId == 'en.usa#holiday@group.v.calendar.google.com') {
                return [];
            }
            console.log('Getting events for calendarId', calendarId, 'from server');
            return $http.get('/api/calendars/' + calendarId + '/events')
                .then(function successCallback(response) {
                    response.data.forEach(function(event, index, events) {
                        event.calendarId = calendarId;
                    });
                    return response.data;
                }, function errorCallback(err, code) {
                    console.log('Error when getting events from server', err, code);
                });
        }

        $scope.getCalendarNameById = function(calendarId) {
            return $scope.calendarsMap[calendarId].summary;
        };

        // // LIST
        // $scope.listEvents = function() {
        //     $http.get('/api/events').then(function success(response) {
        //         $scope.calendarEvents = [];
        //         // var events = [response];
        //         response.data.map(function(event) {
        //             var calendarEvent = {
        //                 summary: event.summary,
        //                 description: event.description,
        //                 location: event.location,
        //             };
        //             $scope.calendarEvents.push(calendarEvent);
        //         });
        //         // $scope.calendarEvents = response.data;
        //         console.log('Events retrieved from primary calendar', $scope.calendarEvents);
        //     }, function error(err) {
        //         console.log('Error getting events from server: ' + err);
        //     });
        // };

        //////////////////////////////////////////////////////////////////////////////////////
        // COLOR
        //////////////////////////////////////////////////////////////////////////////////////

        // GET
        function loadColorPalette(colorId) {
            $http.get('/api/calendars/colors').then(function successCallback(response) {
                console.log('Retrieved colors from google calendar', response.data);
                $scope.calendarColors = response.data.calendar;
                $scope.eventColors = response.data.event;
            }, function errorCallback(err) {
                console.log('Error when getting color palette from server', err);
            });
        }

        //////////////////////////////////////////////////////////////////////////////////////
        // COLOR UTILITIES
        //////////////////////////////////////////////////////////////////////////////////////

        // NOTE: INEFFICIENT -> could store in a map or get from server
        $scope.getCalendarColors = function(calendarId) {
            return $scope.calendarsMap[calendarId].backgroundColor;
        };

        $scope.getGoogleCalendarColors = function(colorId) {
            return $scope.calendarColors[colorId];
        };

        // http://stackoverflow.com/questions/13712697/set-background-color-in-hex
        $scope.getFontFromBackground = function(backgroundHex) {
            var rgb = hexToRgb(backgroundHex);
            var o = Math.round(((parseInt(rgb[1]) * 299) + (parseInt(rgb[2]) * 587) + (parseInt(rgb[3]) * 114)) / 1000);

            if (o > 125) {
                return 'black';
            }
            return '#FFFFFF';
        }

        // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result;
        }

        //

        $scope.showDateTimePicker = function(ev) {
            console.log('Showing time picker');
            // $scope.calendarEvent.startDateTime = new Date();
            $mdpDatePicker($scope.calendarEvent.startDateTime, {
                targetEvent: ev
            }).then(function(selectedDate) {
                console.log('Selected start date', selectedDate);
                $scope.calendarEvent.startDateTime = selectedDate;
                $mdpTimePicker($scope.calendarEvent.startDateTime, {
                    targetEvent: ev
                }).then(function(selectedTime) {
                    console.log('Selected start time', selectedTime);
                    $scope.calendarEvent.startDateTime = selectedTime;
                });
            });

        };

        //////////////////////////////////////////////////////////////////////////////////////
        //  LOAD ALL EVENTS FOR ALL CALENDARS
        //////////////////////////////////////////////////////////////////////////////////////

        function loadAllEvents() {
            // get calendars
            var calendarsPromise = listCalendars();
            calendarsPromise.then(function(calendars) {
                // set calendars in scope
                $scope.calendars = calendars;

                var eventsPromises = calendars.map(function(calendar, index) {
                    return getEvents(calendar.id);
                });
                Promise.all(eventsPromises).then(function(eventsByCalendar) {
                    console.log('Events by calendar', eventsByCalendar);
                    var allEvents = [].concat.apply([], eventsByCalendar);
                    console.log('All events', allEvents);
                    $scope.events = allEvents;
                    $scope.$apply();
                });
            });
        }


    });

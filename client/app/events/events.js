'use strict';

angular.module('metacookApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',
                views: {
                    'main': {
                        templateUrl: 'app/events/events.html',
                        controller: 'EventsController'
                    },
                    'other': {
                        templateUrl: 'app/account/signup/signup.html',
                        controller: 'SignupCtrl'
                    }
                }
            });
    });

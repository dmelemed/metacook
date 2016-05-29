'use strict';

angular.module('metacookApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('calendar', {
      	url: '/calendar',
      	templateUrl: 'app/calendar/calendar.html',
      	controller: 'CalendarController'
      });
  });
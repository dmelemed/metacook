'use strict';

angular.module('metacookApp')
    .controller('CalendarController', function($scope, $http) {
        var imagePath = 'img/list/60.jpeg';
        $scope.calendarEvents = [];
        for (var i = 0; i < 3; i++) {
            $scope.calendarEvents.push({
                face: imagePath,
                description: "Brunch this weekend?",
                category: "Min Li Chan",
                notes: "I'll be in your neighborhood doing errands."
            });
        }

        $scope.browseBy = ['Inbox', 'Today', 'Next 7 days'];
        $scope.categories = ['Projects', 'Studying', 'Personal', 'Organization'];

        $scope.calendarEvent = {};

        $scope.addCalendarEvent = function(item) {
            console.log(item);
            $scope.calendarEvents.push(item);
            $scope.calendarEvent = {};
        }
    });
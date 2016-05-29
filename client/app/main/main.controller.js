'use strict';

angular.module('metacookApp')
    .controller('MainCtrl', function($scope, $http) {
        var imagePath = 'img/list/60.jpeg';
        $scope.todos = [];
        for (var i = 0; i < 15; i++) {
            $scope.todos.push({
                face: imagePath,
                what: "Brunch this weekend?",
                who: "Min Li Chan",
                notes: "I'll be in your neighborhood doing errands."
            });
        }
    });

'use strict';

angular.module('metacookApp')
  .controller('RecipesController', function ($scope, $http) {
    $scope.recipes = [];

    $http.get('/api/recipes').success(function(recipes) {
      $scope.recipes = recipes;
      console.log(recipes);
    });

    $scope.getColor = function($index) {
      var _d = ($index + 1) % 11;
      var bg = '';

      switch(_d) {
        case 1:       bg = 'red';         break;
        case 2:       bg = 'green';       break;
        case 3:       bg = 'darkBlue';    break;
        case 4:       bg = 'blue';        break;
        case 5:       bg = 'yellow';      break;
        case 6:       bg = 'pink';        break;
        case 7:       bg = 'darkBlue';    break;
        case 8:       bg = 'purple';      break;
        case 9:       bg = 'deepBlue';    break;
        case 10:      bg = 'lightPurple'; break;
        default:      bg = 'yellow';      break;
      }

      return bg;
    };

    $scope.getSpan = function($index) {
      var _d = ($index + 1) % 11;

      if (_d === 1 || _d === 5) {
        return 2;
      }
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.recipeUrl = {
      url: ''
    };

    $scope.imageUrl = '';

    $scope.getImage = function(recipeUrl) {
      console.log('invoked');
      console.log(recipeUrl);
      $http.post('/api/ogImage', recipeUrl).success(function(result) {
        //$scope.result = result;
        console.log(result);
        $scope.imageUrl = result.data.ogImage.url;
      }).error(function() {
        console.log('error');
      });
    };
  });

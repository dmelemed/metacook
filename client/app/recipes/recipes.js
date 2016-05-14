'use strict';

angular.module('metacookApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recipes', {
      	url: '/recipes',
      	templateUrl: 'app/recipes/recipes.html',
      	controller: 'RecipesController'
      });
  });
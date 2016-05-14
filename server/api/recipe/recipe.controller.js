/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Recipes              ->  index
 * POST    /Recipes              ->  create
 * GET     /Recipes/:id          ->  show
 * PUT     /Recipes/:id          ->  update
 * DELETE  /Recipes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Recipe = require('./recipe.model');

// Get list of Recipes
exports.index = function(req, res) {
  Recipe.find(function (err, Recipes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(Recipes);
  });
};

// Get a single Recipe
exports.show = function(req, res) {
  Recipe.findById(req.params.id, function (err, Recipe) {
    if(err) { return handleError(res, err); }
    if(!Recipe) { return res.status(404).send('Not Found'); }
    return res.json(Recipe);
  });
};

// Creates a new Recipe in the DB.
exports.create = function(req, res) {
  Recipe.create(req.body, function(err, Recipe) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(Recipe);
  });
};

// Updates an existing Recipe in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Recipe.findById(req.params.id, function (err, Recipe) {
    if (err) { return handleError(res, err); }
    if(!Recipe) { return res.status(404).send('Not Found'); }
    var updated = _.merge(Recipe, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(Recipe);
    });
  });
};

// Deletes a Recipe from the DB.
exports.destroy = function(req, res) {
  Recipe.findById(req.params.id, function (err, Recipe) {
    if(err) { return handleError(res, err); }
    if(!Recipe) { return res.status(404).send('Not Found'); }
    Recipe.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

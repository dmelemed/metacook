'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  name: String,
  author: String,
  ingredients: String,
  time: String,
  active: Boolean,
  imageUrl: String
});

module.exports = mongoose.model('Recipe', RecipeSchema);
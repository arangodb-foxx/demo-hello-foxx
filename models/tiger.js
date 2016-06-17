'use strict';

const _ = require('lodash');
const joi = require('joi');

exports.Tiger = function (data) {
  this.name = data.name;
  this.size = null;
  this.typeOfCat = "A tiger";
  this.sound = "Rrrrrrrr";

  this.growl = function() {
    return this.sound;
  };
};

exports.Model = {
  schema: joi.object({
    name: joi.string().required(),
    size: joi.number().optional(),
    typeOfCat: joi.string().required(),
    sound: joi.string().required()
  }).required(),

  forClient (data) {
    return _.omit(data, ['_key', '_id', '_rev']);
  }
};

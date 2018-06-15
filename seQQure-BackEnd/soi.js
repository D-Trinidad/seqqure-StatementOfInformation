const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  improvements: Joi.string().required(),
  occupiedBy: Joi.string().required(),
  construction: Joi.string().required(),
  workNature: Joi.string().allow(""),
  firstName: Joi.string().required(),
  middleName: Joi.string().allow(""),
  lastName: Joi.string().required(),
  aka: Joi.string().allow(""),
  socialSecurity: Joi.string().length(9),
  driversLicense: Joi.string().allow(""),
  birthPlace: Joi.string().allow(""),
  dateOfBirth: Joi.date().required(),
  relationshipStatus: Joi.string().required(),
  currentPartner: Joi.string().allow(""),
  ex: Joi.string().allow(""),
  id: Joi.objectId(),
  personId: Joi.string().required(),
  jobs: Joi.array().allow([]),
  residences: Joi.array().allow([]),
  modifiedById: Joi.object().required(),
  modifiedDate: Joi.date().required(),
  createdById: Joi.object().allow({}),
  tenantId: Joi.object().required(),
  finalSave: Joi.bool(),
  escrowId: Joi.string().required()
};

module.exports = Joi.object().keys(schema);

const FirstAppeal = require('../models/firstAppeal');
const Joi = require('joi');

// Validation schema for first appeal
const firstAppealSchema = Joi.object({
  application_id: Joi.number().integer().required(),
  appeal_date: Joi.date().required(),
  receive_date: Joi.date().required(),
  user_id: Joi.number().integer().required(),
  appeal_reason: Joi.string().required(),
  hearing_date: Joi.string().allow('', null),
  ref_no: Joi.string().allow('', null),
  ref_date: Joi.string().allow('', null),
  appeal_no: Joi.string().allow('', null),
  appeal_authority_id: Joi.number().integer().required(),
  memo_no: Joi.string().allow('', null),
  memo_date: Joi.string().allow('', null)
});

// Controller methods
const firstAppealController = {
  // Create a new first appeal
  create: async (req, res) => {
    try {
      // Validate request body
      const { error, value } = firstAppealSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details
        });
      }
      
      // Create first appeal object
      const newAppeal = new FirstAppeal(value);
      
      // Insert appeal using stored procedure
      const result = await FirstAppeal.create(newAppeal);
      
      return res.status(201).json({
        success: true,
        message: 'First appeal created successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in firstAppealController.create:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create first appeal',
        error: error.message
      });
    }
  },
  
  // Get first appeal by ID
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Appeal ID is required'
        });
      }
      
      const appeal = await FirstAppeal.findById(id);
      
      if (!appeal) {
        return res.status(404).json({
          success: false,
          message: 'First appeal not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: appeal
      });
    } catch (error) {
      console.error('Error in firstAppealController.getById:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve first appeal',
        error: error.message
      });
    }
  },
  
  // Get first appeals by application ID
  getByApplicationId: async (req, res) => {
    try {
      const applicationId = req.params.applicationId;
      
      if (!applicationId) {
        return res.status(400).json({
          success: false,
          message: 'Application ID is required'
        });
      }
      
      const appeals = await FirstAppeal.findByApplicationId(applicationId);
      
      return res.status(200).json({
        success: true,
        data: appeals
      });
    } catch (error) {
      console.error('Error in firstAppealController.getByApplicationId:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve first appeals',
        error: error.message
      });
    }
  }
};

module.exports = firstAppealController;
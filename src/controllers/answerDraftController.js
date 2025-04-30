const AnswerDraft = require('../models/AnswerDraft');
const ErrorLogger = require('../utils/errorLogger');

const answerDraftController = {
  async update(req, res) {
    try {
      const { application_id } = req.body;

      // Validate required fields
      if (!application_id) {
        return res.status(400).json({
          success: false,
          message: 'application_id is required'
        });
      }

      // Check if application_id is a valid number
      if (isNaN(parseInt(application_id))) {
        return res.status(400).json({
          success: false,
          message: 'application_id must be a valid number'
        });
      }

      // Call the model to update the answer draft flag
      await AnswerDraft.update(application_id);

      res.status(200).json({
        success: true,
        message: 'Answer draft flag updated successfully'
      });
    } catch (error) {
      await ErrorLogger.logError('UpdateAnswerDraftFlag', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const { application_id, user_id, answerDtls } = req.body;

      // Validate required fields
      if (!application_id || !user_id || !answerDtls) {
        return res.status(400).json({
          success: false,
          message: 'application_id, user_id, and answerDtls are required'
        });
      }

      // Validate answerDtls structure
      if (!Array.isArray(answerDtls)) {
        return res.status(400).json({
          success: false,
          message: 'answerDtls must be an array'
        });
      }

      for (const answer of answerDtls) {
        if (!answer.answer || !Array.isArray(answer.queryDtls) || !Array.isArray(answer.sectionDtls)) {
          return res.status(400).json({
            success: false,
            message: 'Each answer must have answer text, queryDtls array, and sectionDtls array'
          });
        }
      }

      const result = await AnswerDraft.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Final answer created successfully'
      });
    } catch (error) {
      await ErrorLogger.logError('CreateFinalAnswer', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = answerDraftController;
const FinalAnswer = require('../models/finalAnswer');
const ErrorLogger = require('../utils/errorLogger');

const finalAnswerController = {
  async create(req, res) {
    try {
      const { final_answer } = req.body;

      // Validate required fields
      if (!final_answer) {
        return res.status(400).json({
          success: false,
          message: 'final_answer object is required'
        });
      }

      const { application_id, user_id, answerDtls } = final_answer;

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

      const result = await FinalAnswer.create(final_answer);

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

module.exports = finalAnswerController;
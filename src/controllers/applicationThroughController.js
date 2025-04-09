const ApplicationThrough = require('../models/applicationThrough');

const applicationThroughController = {
  async insertApplicationThrough(req, res) {
    try {
      const { applicationThroughName, userId } = req.body;

      const error_code = await ApplicationThrough.create({
        applicationThroughName,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Application through created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create application through' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getApplicationThrough(req, res) {
    try {
      const { userId = 0 } = req.query;
      const results = await ApplicationThrough.get(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = applicationThroughController;
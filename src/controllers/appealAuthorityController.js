const AppealAuthorityMember = require('../models/appealAuthorityMember');

const appealAuthorityController = {
  async insertAppealAuthorityMember(req, res) {
    try {
      const {
        designation,
        organization,
        address,
        email,
        userId
      } = req.body;

      const error_code = await AppealAuthorityMember.create({
        designation,
        organization,
        address,
        email,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Appeal authority member created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create appeal authority member' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAppealAuthorityMember(req, res) {
    try {
      const { userId } = req.query;

      const results = await AppealAuthorityMember.getByUser(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = appealAuthorityController;
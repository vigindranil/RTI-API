const EndorseMember = require('../models/endorseMember');

const endorseMemberController = {
  async insertEndorseMember(req, res) {
    try {
      const {
        name,
        designation,
        organization,
        address,
        email,
        userId
      } = req.body;

      const error_code = await EndorseMember.create({
        name,
        designation,
        organization,
        address,
        email,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Endorse member created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create endorse member' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEndorseMember(req, res) {
    try {
      const { userId } = req.query;
      const results = await EndorseMember.get(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = endorseMemberController;
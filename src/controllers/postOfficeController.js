const PostOffice = require('../models/postOffice');

const postOfficeController = {
  async insertPostOffice(req, res) {
    try {
      const { postOfficeName, psId, userId } = req.body;

      const error_code = await PostOffice.create({
        postOfficeName,
        psId,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Post office created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create post office' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPostOffices(req, res) {
    try {
      const { psId = 0 } = req.query;
      const results = await PostOffice.get(psId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = postOfficeController;
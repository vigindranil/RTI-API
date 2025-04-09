const District = require('../models/district');

const districtController = {
  async insertDistrict(req, res) {
    try {
      const { districtName, stateId, userId } = req.body;

      const error_code = await District.create({ districtName, stateId, userId });

      if (error_code === 0) {
        res.status(201).json({ message: 'District created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create district' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getDistrict(req, res) {
    try {
      const { stateId, districtId } = req.query;
      const results = await District.get(stateId, districtId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = districtController;
const Municipality = require('../models/municipality');

const municipalityController = {
  async insertMunicipality(req, res) {
    try {
      const { municipalityName, districtId, userId } = req.body;

      const error_code = await Municipality.create({
        municipalityName,
        districtId,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Municipality created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create municipality' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMunicipalities(req, res) {
    try {
      const { districtId = 0 } = req.query;
      const results = await Municipality.get(districtId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = municipalityController;
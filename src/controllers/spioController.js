const Spio = require('../models/spio');

const spioController = {
  async insertSpio(req, res) {
    try {
      const {
        name,
        designation,
        contactNumber,
        email,
        officeAddress,
        description,
        departmentId,
        userId,
        districtId
      } = req.body;

      const error_code = await Spio.create({
        name,
        designation,
        contactNumber,
        email,
        officeAddress,
        description,
        departmentId,
        userId,
        districtId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'SPIO created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create SPIO' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSpioDetails(req, res) {
    try {
      const { stateId, departmentId, districtId, spioId } = req.query;
      const results = await Spio.get(stateId, departmentId, districtId, spioId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = spioController;
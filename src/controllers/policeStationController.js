const PoliceStation = require('../models/policeStation');

const policeStationController = {
  async insertPoliceStation(req, res) {
    try {
      const { policestationName, districtId, userId } = req.body;

      const error_code = await PoliceStation.create({
        policestationName,
        districtId,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Police station created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create police station' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPoliceStations(req, res) {
    try {
      const { districtId = 0 } = req.query;
      const results = await PoliceStation.get(districtId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = policeStationController;
const State = require('../models/state');

const stateController = {
  async insertState(req, res) {
    try {
      const { stateName, userId } = req.body;

      const error_code = await State.create({ stateName, userId });

      if (error_code === 0) {
        res.status(201).json({ message: 'State created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create state' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getState(req, res) {
    try {
      const { stateId = 0 } = req.query;
      const results = await State.get(stateId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = stateController;
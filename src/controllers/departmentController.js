const Department = require('../models/department');

const departmentController = {
  async insertDepartment(req, res) {
    try {
      const { departmentName, departmentCode, stateId, userId } = req.body;

      const error_code = await Department.create({
        departmentName,
        departmentCode,
        stateId,
        userId
      });

      if (error_code === 0) {
        res.status(201).json({ message: 'Department created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create department' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getDepartment(req, res) {
    try {
      const { departmentId = 0, stateId = 0 } = req.query;
      const results = await Department.get(departmentId, stateId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = departmentController;
const Committee = require('../models/committee');

const committeeController = {
  async insertCommitteeDepartment(req, res) {
    try {
      const { departmentId, committeName, email, address, organization, userId } = req.body;

      const errorCode = await Committee.createDepartment({
        departmentId,
        committeName,
        email,
        address,
        organization,
        userId
      });

      if (errorCode === 0) {
        res.status(201).json({ message: 'Committee department created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create committee department' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCommitteeDepartment(req, res) {
    try {
      const { departmentId = 0, userId } = req.query;
      const results = await Committee.getDepartment(departmentId, userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async insertCommitteeMember(req, res) {
    try {
      const { committeeId, name, designation, email, phoneNumber, userId } = req.body;

      const errorCode = await Committee.createMember({
        committeeId,
        name,
        designation,
        email,
        phoneNumber,
        userId
      });

      if (errorCode === 0) {
        res.status(201).json({ message: 'Committee member created successfully' });
      } else {
        res.status(400).json({ error: 'Failed to create committee member' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCommitteeMember(req, res) {
    try {
      const { userId, committeeId } = req.query;
      const results = await Committee.getMember(userId, committeeId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = committeeController;
const Assignment = require('../models/Assignment');
const AssetInventory = require('../models/AssetInventory');
const Base = require('../models/Base');
const AssetType = require('../models/AssetType');
const User = require('../models/User');

const getAssignments = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let filter = {};
    
    if (req.baseFilter.baseId) {
      filter.baseId = req.baseFilter.baseId;
    }
    
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.assignmentDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.assignmentDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.assignmentDate.$lte = end;
      }
    }

    console.log('🔍 Assignment filter:', filter);

    const assignments = await Assignment.find(filter)
      .populate('baseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('personnelId', 'username email')
      .populate('assignedBy', 'username')
      .sort({ assignmentDate: -1 });

    console.log('👤 Found assignments:', assignments.length);

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const assignmentData = {
      ...req.body,
      assignedBy: req.user._id,
      status: 'active'
    };

    console.log('👤 Creating assignment with data:', assignmentData);

   
    const assignmentDate = new Date(assignmentData.assignmentDate);
    const dateKey = new Date(assignmentDate.getFullYear(), assignmentDate.getMonth(), assignmentDate.getDate());
    
    const inventory = await AssetInventory.findOne({
      baseId: assignmentData.baseId,
      assetTypeId: assignmentData.assetTypeId,
      date: dateKey
    });

    if (inventory && inventory.closingBalance < assignmentData.quantity) {
      return res.status(400).json({ 
        error: `Insufficient inventory! Available: ${inventory.closingBalance}, Requested: ${assignmentData.quantity}` 
      });
    }

    const assignment = await Assignment.create(assignmentData);

   
    await updateAssignmentInventory(assignment);

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('baseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('personnelId', 'username email')
      .populate('assignedBy', 'username');

    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).json({ error: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('baseId', 'name code')
      .populate('assetTypeId', 'name category unit')
      .populate('personnelId', 'username email')
      .populate('assignedBy', 'username');

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    
    await updateAssignmentInventory(assignment);

    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAssignmentInventory = async (assignment) => {
  try {
    const assignmentDate = new Date(assignment.assignmentDate);
    const dateKey = new Date(assignmentDate.getFullYear(), assignmentDate.getMonth(), assignmentDate.getDate());

    let assignedChange = 0;
    let expendedChange = 0;

    if (assignment.status === 'active') {
      assignedChange = assignment.quantity;
    } else if (assignment.status === 'returned') {
      assignedChange = -assignment.quantity;
    } else if (assignment.status === 'lost') {
      assignedChange = -assignment.quantity;
      expendedChange = assignment.quantity;
    }

    const result = await AssetInventory.findOneAndUpdate(
      {
        baseId: assignment.baseId,
        assetTypeId: assignment.assetTypeId,
        date: dateKey
      },
      {
        $inc: { 
          assigned: assignedChange,
          expended: expendedChange,
          closingBalance: -(assignedChange + expendedChange)
        },
        $setOnInsert: {
          openingBalance: 0,
          purchases: 0,
          transfersIn: 0,
          transfersOut: 0
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );

    console.log(' Assignment inventory updated:', {
      assigned: result.assigned,
      expended: result.expended,
      closingBalance: result.closingBalance
    });
  } catch (error) {
    console.error(' Error updating assignment inventory:', error);
    throw error;
  }
};

const getAssignmentOptions = async (req, res) => {
  try {
    const bases = await Base.find({ isActive: true });
    const assetTypes = await AssetType.find({ isActive: true });
    const personnel = await User.find({ 
      isActive: true,
      role: { $in: ['logistics_officer', 'base_commander'] }
    }).select('username email baseId');
    
    res.json({
      bases,
      assetTypes,
      personnel
    });
  } catch (error) {
    console.error('Error fetching assignment options:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAssignments, createAssignment, updateAssignment, getAssignmentOptions };
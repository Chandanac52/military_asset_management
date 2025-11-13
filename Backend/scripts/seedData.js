const mongoose = require('mongoose');
const User = require('../models/User');
const Base = require('../models/Base');
const AssetType = require('../models/AssetType');
const AssetInventory = require('../models/AssetInventory');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
require('dotenv').config();

const seedData = async () => {
  try {
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB successfully');

   
    console.log(' Clearing existing data...');
    await User.deleteMany({});
    await Base.deleteMany({});
    await AssetType.deleteMany({});
    await AssetInventory.deleteMany({});
    await Purchase.deleteMany({});
    await Transfer.deleteMany({});
    await Assignment.deleteMany({});
    console.log(' Cleared all existing data');

    
    console.log(' Creating military bases...');
    const bases = await Base.insertMany([
      {
        name: 'Headquarters Command',
        code: 'HQ-CMD',
        location: 'Capital City, Central Region',
        contact: 'hq-command@military.mil',
        isActive: true
      },
      {
        name: 'Northern Frontier Base',
        code: 'NFB',
        location: 'Arctic Region, Northern Territory',
        contact: 'northern.command@military.mil',
        isActive: true
      },
      {
        name: 'Southern Coastal Base',
        code: 'SCB',
        location: 'Coastal Region, Southern Territory',
        contact: 'southern.command@military.mil',
        isActive: true
      }
    ]);
    console.log(` Created ${bases.length} military bases`);

   
    console.log(' Creating asset types...');
    const assetTypes = await AssetType.insertMany([
      {
        category: 'weapon',
        name: 'Assault Rifle M4A1',
        model: 'M4A1 Carbine',
        unit: 'pieces',
        isActive: true
      },
      {
        category: 'weapon',
        name: 'Combat Pistol M9',
        model: 'M9 Beretta',
        unit: 'pieces',
        isActive: true
      },
      {
        category: 'vehicle',
        name: 'Armored Humvee',
        model: 'M1151 Up-Armored',
        unit: 'units',
        isActive: true
      },
      {
        category: 'ammunition',
        name: '5.56mm Ball Ammunition',
        model: 'M855',
        unit: 'rounds',
        isActive: true
      },
      {
        category: 'equipment',
        name: 'Night Vision Goggles',
        model: 'PVS-14',
        unit: 'pieces',
        isActive: true
      }
    ]);
    console.log(` Created ${assetTypes.length} asset types`);

   
    console.log(' Creating users...');
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@military.mil',
        password: 'password123',
        role: 'admin',
        isActive: true
      },
      {
        username: 'commander_north',
        email: 'commander.north@military.mil',
        password: 'password123',
        role: 'base_commander',
        baseId: bases[1]._id,
        isActive: true
      },
      {
        username: 'logistics1',
        email: 'logistics1@military.mil',
        password: 'password123',
        role: 'logistics_officer',
        isActive: true
      },
      {
        username: 'soldier_alpha',
        email: 'soldier.alpha@military.mil',
        password: 'password123',
        role: 'logistics_officer',
        baseId: bases[1]._id,
        isActive: true
      },
      {
        username: 'soldier_bravo',
        email: 'soldier.bravo@military.mil',
        password: 'password123',
        role: 'logistics_officer',
        baseId: bases[2]._id,
        isActive: true
      }
    ]);
    console.log(` Created ${users.length} users`);

    
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    
    console.log(' Creating realistic inventory data...');
    const inventoryData = [];
    
   
    inventoryData.push({
      baseId: bases[0]._id,
      assetTypeId: assetTypes[0]._id, 
      openingBalance: 45,
      purchases: 15,
      transfersIn: 8,
      transfersOut: 5,
      assigned: 12,
      expended: 3,
      closingBalance: 45 + 15 + 8 - 5 - 12 - 3, 
      date: todayDate
    });
    
    inventoryData.push({
      baseId: bases[0]._id,
      assetTypeId: assetTypes[3]._id, 
      openingBalance: 2500,
      purchases: 800,
      transfersIn: 200,
      transfersOut: 150,
      assigned: 300,
      expended: 75,
      closingBalance: 2500 + 800 + 200 - 150 - 300 - 75, 
      date: todayDate
    });

    
    inventoryData.push({
      baseId: bases[1]._id,
      assetTypeId: assetTypes[0]._id, 
      openingBalance: 32,
      purchases: 10,
      transfersIn: 6,
      transfersOut: 4,
      assigned: 8,
      expended: 2,
      closingBalance: 32 + 10 + 6 - 4 - 8 - 2, 
      date: todayDate
    });

    
    inventoryData.push({
      baseId: bases[2]._id,
      assetTypeId: assetTypes[2]._id, 
      openingBalance: 6,
      purchases: 2,
      transfersIn: 1,
      transfersOut: 0,
      assigned: 3,
      expended: 1,
      closingBalance: 6 + 2 + 1 - 0 - 3 - 1, 
      date: todayDate
    });

    await AssetInventory.insertMany(inventoryData);
    console.log(` Created ${inventoryData.length} realistic inventory records`);

    
    console.log(' Creating realistic purchases...');
    
    const purchaseData = [
      {
        baseId: bases[0]._id,
        assetTypeId: assetTypes[0]._id, 
        quantity: 15,
        unitCost: 1200,
        totalCost: 15 * 1200, 
        purchaseDate: todayDate,
        supplier: 'Colt Defense',
        purchaseOrder: 'PO-001',
        receivedBy: users[0]._id,
        status: 'received'
      },
      {
        baseId: bases[1]._id,
        assetTypeId: assetTypes[3]._id, 
        quantity: 800,
        unitCost: 0.75,
        totalCost: 800 * 0.75, 
        purchaseDate: todayDate,
        supplier: 'Lake City Army',
        purchaseOrder: 'PO-002',
        receivedBy: users[0]._id,
        status: 'received'
      },
      {
        baseId: bases[2]._id,
        assetTypeId: assetTypes[2]._id, 
        quantity: 2,
        unitCost: 25000,
        totalCost: 2 * 25000, 
        purchaseDate: todayDate,
        supplier: 'AM General',
        purchaseOrder: 'PO-003',
        receivedBy: users[0]._id,
        status: 'received'
      },
      {
        baseId: bases[0]._id,
        assetTypeId: assetTypes[4]._id, 
        quantity: 8,
        unitCost: 3500,
        totalCost: 8 * 3500, 
        purchaseDate: todayDate,
        supplier: 'L3Harris',
        purchaseOrder: 'PO-004',
        receivedBy: users[0]._id,
        status: 'received'
      }
    ];

    const purchases = await Purchase.insertMany(purchaseData);
    console.log(` Created ${purchases.length} purchases with proper costs`);
    
    
    purchases.forEach(purchase => {
      console.log(`   - ${purchase.quantity} × ₹${purchase.unitCost} = ₹${purchase.totalCost}`);
    });

    
    console.log(' Creating realistic assignments...');
    const assignments = await Assignment.create([
      {
        baseId: bases[0]._id,
        assetTypeId: assetTypes[0]._id, 
        personnelId: users[3]._id,
        quantity: 5,
        assignmentDate: todayDate,
        assignedBy: users[0]._id,
        status: 'active',
        notes: 'Patrol duty assignment'
      },
      {
        baseId: bases[1]._id,
        assetTypeId: assetTypes[0]._id, 
        personnelId: users[3]._id,
        quantity: 3,
        assignmentDate: todayDate,
        assignedBy: users[1]._id,
        status: 'active',
        notes: 'Border patrol'
      },
      {
        baseId: bases[2]._id,
        assetTypeId: assetTypes[2]._id, 
        personnelId: users[4]._id,
        quantity: 1,
        assignmentDate: todayDate,
        assignedBy: users[0]._id,
        status: 'returned',
        returnDate: todayDate,
        notes: 'Training exercise completed'
      },
      {
        baseId: bases[0]._id,
        assetTypeId: assetTypes[3]._id, 
        personnelId: users[3]._id,
        quantity: 150,
        assignmentDate: todayDate,
        assignedBy: users[0]._id,
        status: 'active',
        notes: 'Training ammunition'
      }
    ]);
    console.log(` Created ${assignments.length} realistic assignments`);

    
    console.log(' Creating realistic transfers...');
    const transfers = await Transfer.create([
      {
        fromBaseId: bases[0]._id,
        toBaseId: bases[1]._id,
        assetTypeId: assetTypes[0]._id, 
        quantity: 3,
        transferDate: todayDate,
        initiatedBy: users[0]._id,
        status: 'completed',
        approvedBy: users[0]._id,
        notes: 'Reinforcement transfer'
      },
      {
        fromBaseId: bases[0]._id,
        toBaseId: bases[2]._id,
        assetTypeId: assetTypes[3]._id, 
        quantity: 200,
        transferDate: todayDate,
        initiatedBy: users[0]._id,
        status: 'in_transit',
        notes: 'Ammunition supply'
      }
    ]);
    console.log(` Created ${transfers.length} realistic transfers`);

    console.log('\n' + '='.repeat(60));
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(` Military Bases: ${bases.length}`);
    console.log(` Asset Types: ${assetTypes.length}`);
    console.log(` Users: ${users.length}`);
    console.log(` Inventory Records: ${inventoryData.length}`);
    console.log(` Purchases: ${purchases.length}`);
    console.log(` Assignments: ${assignments.length}`);
    console.log(` Transfers: ${transfers.length}`);
    console.log('='.repeat(60));
    
    console.log('\n LOGIN CREDENTIALS:');
    console.log('    Admin: admin / password123');
    console.log('    Base Commander: commander_north / password123');
    console.log('    Logistics Officer: logistics1 / password123');
    console.log('='.repeat(60));
    
    console.log('\n EXPECTED DASHBOARD TOTALS (SMALLER NUMBERS):');
    const totalOpening = inventoryData.reduce((sum, inv) => sum + inv.openingBalance, 0);
    const totalClosing = inventoryData.reduce((sum, inv) => sum + inv.closingBalance, 0);
    const totalPurchases = inventoryData.reduce((sum, inv) => sum + inv.purchases, 0);
    const totalAssigned = inventoryData.reduce((sum, inv) => sum + inv.assigned, 0);
    const totalExpended = inventoryData.reduce((sum, inv) => sum + inv.expended, 0);
    const totalPurchaseCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
    
    console.log(`   Opening Balance: ${totalOpening}`);
    console.log(`   Closing Balance: ${totalClosing}`);
    console.log(`   Total Purchases: ${totalPurchases}`);
    console.log(`   Assets Assigned: ${totalAssigned}`);
    console.log(`   Assets Expended: ${totalExpended}`);
    console.log(`   Total Purchase Cost: ₹${totalPurchaseCost.toLocaleString()}`);
    console.log('='.repeat(60));

    console.log('\n PURCHASE BREAKDOWN:');
    purchases.forEach(p => {
      console.log(`   - ${p.assetTypeId?.name || 'Asset'}: ${p.quantity} × ₹${p.unitCost} = ₹${p.totalCost.toLocaleString()}`);
    });
    console.log('='.repeat(60));

    process.exit(0);

  } catch (error) {
    console.error('\n ERROR SEEDING DATABASE:');
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    
    if (error.errors) {
      console.error('\n Validation Errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
    }
    
    process.exit(1);
  }
};


seedData();
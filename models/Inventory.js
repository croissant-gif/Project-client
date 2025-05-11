import mongoose from 'mongoose';

// Define the schema for each item in the inventory
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },

});

// Define the schema for the inventory, which holds an array of items
const InventorySchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true }, // Ensure roomId is unique
  inventory: [ItemSchema],
});

// Optional: Index the roomId for faster lookup
InventorySchema.index({ roomId: 1 });

// Use a singleton pattern to avoid redefining the model
const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);

export default Inventory;

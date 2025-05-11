import dbConnect from '../../../../utils/dbConnect';
import Inventory from '../../../../models/Inventory';
import mongoose from 'mongoose'; // Ensure mongoose is imported

// Connect to the database
dbConnect();

//=================================================================================================================================================================================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId'); // Extract roomId from query parameters

  if (!roomId) {
    return new Response('Room ID is required', { status: 400 });
  }

  try {
    // Attempt to find the inventory for the roomId
    let inventory = await Inventory.findOne({ roomId });

    if (!inventory) {
      // If no inventory found, return a message instead of creating a new document
      return new Response('Inventory not found for this room', { status: 404 });
    }

    // Return the inventory items (either found or empty array if no items)
    return new Response(JSON.stringify(inventory.inventory), { status: 200 });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return new Response('Failed to fetch inventory', { status: 500 });
  }
}


//=================================================================================================================================================================================
export async function POST(request) {
  const body = await request.json();
  try {
    const { roomId, item } = body;

    // Ensure the item has necessary properties
    if (!item || !item.name || !item.quantity) {
      return new Response('Item must have a name and quantity', { status: 400 });
    }

    // Check if the room exists and if the item already exists in the inventory
    const inventory = await Inventory.findOne({ roomId });

    if (inventory) {
      // Check if the item already exists in the inventory
      const existingItemIndex = inventory.inventory.findIndex(
        (existingItem) => existingItem.name === item.name
      );

      if (existingItemIndex !== -1) {
        // Item exists, update its quantity
        inventory.inventory[existingItemIndex].quantity += item.quantity;
        await inventory.save();
      } else {
        // Item does not exist, add a new item
        inventory.inventory.push(item);
        await inventory.save();
      }

      return new Response(JSON.stringify(inventory.inventory), { status: 201 });
    } else {
      // No inventory found for this room, create a new one
      const newInventory = new Inventory({
        roomId,
        inventory: [item],
      });
      await newInventory.save();
      return new Response(JSON.stringify(newInventory.inventory), { status: 201 });
    }
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    return new Response('Failed to add item: ' + error.message, { status: 400 });
  }
}



//=================================================================================================================================================================================
export async function DELETE(request) {
  const body = await request.json();
  try {
    const { roomId, itemId } = body;

    // Ensure that both roomId and itemId are present
    if (!roomId || !itemId) {
      return new Response('Room ID and Item ID are required', { status: 400 });
    }

    // Delete the item with the matching itemId from the inventory of the specified roomId
    await Inventory.updateOne(
      { roomId },  // Find the inventory document by roomId
      { $pull: { inventory: { _id: new mongoose.Types.ObjectId(itemId) } } } // Pull the item by its _id
    );

    return new Response(null, { status: 204 }); // No content on successful deletion
  } catch (error) {
    console.error('Error deleting item:', error);
    return new Response('Failed to delete item', { status: 500 });
  }
}

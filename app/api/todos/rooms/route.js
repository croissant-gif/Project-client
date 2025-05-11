import dbConnect from '../../../../utils/dbConnect'; // Adjust path if needed
import Rooms from '../../../../models/Rooms';  // Make sure your Room model is correct

dbConnect();

// GET handler to fetch rooms
export async function GET() {
  try {
    const rooms = await Rooms.find({}); // Fetch all rooms
    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return new Response('Failed to fetch rooms', { status: 500 });
  }
}

// POST handler to add rooms
export async function POST(request) {
  const body = await request.json();

  const {
    roomName,
    roomType,
    specialRequest = '',
    assignedTo = null,
    status = '',
    arrivalDate = null,
    departureDate = null,
    arrivalTime = ''
  } = body;

  if (!roomName || !roomType) {
    return new Response('Room name and type are required', { status: 400 });
  }

  try {
    const newRoom = await Rooms.create({
      roomName,
      roomType,
      specialRequest,
      assignedTo,
      status,
      arrivalDate,
      departureDate,
      arrivalTime,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify(newRoom), { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return new Response('Failed to create room', { status: 500 });
  }
}

// DELETE handler to delete a room
export async function DELETE(request) {
  const body = await request.json(); 
  const { id } = body;

  if (!id) {
    return new Response('Room ID is required', { status: 400 });
  }

  try {
    const deletedRoom = await Rooms.findByIdAndDelete(id); 
    if (!deletedRoom) {
      return new Response('Room not found', { status: 404 });
    }

    return new Response(null, { status: 204 }); 
  } catch (error) {
    console.error('Error deleting room:', error);
    return new Response('Failed to delete room', { status: 500 });
  }
}

// PUT handler to update a room's details
export async function PUT(request) {
  const body = await request.json();
  const {
    _id,
    roomName,
    roomType,
    status,
    arrivalDate,
    departureDate,
    arrivalTime,
    assignedTo,
    startTime,     
    finishTime     
  } = body;

  if (!_id) {
    return new Response('Room ID is required', { status: 400 });
  }

  try {
    // Update the room with startTime and finishTime (if provided)
    const updatedRoom = await Rooms.findByIdAndUpdate(
      _id,
      {
        roomName,
        roomType,
        status,
        arrivalDate,
        departureDate,
        arrivalTime,
        assignedTo,
        startTime,   
        finishTime  
      },
      { new: true }
    );

    if (!updatedRoom) {
      return new Response('Room not found', { status: 404 });
    }

    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    console.error('Error updating room:', error);
    return new Response('Failed to update room', { status: 500 });
  }
}

// PATCH handler to update assigned employee
 
export async function PATCH(request) {
  const body = await request.json();
  const { id, assignedTo, specialRequest } = body;

  if (!id) {
    return new Response('Room ID is required', { status: 400 });
  }


  const updateData = {};
  if (assignedTo !== undefined) {
    updateData.assignedTo = assignedTo; 
  }
  if (specialRequest !== undefined) {
    updateData.specialRequest = specialRequest; 
  }

  try {

    const updatedRoom = await Rooms.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedRoom) {
      return new Response('Room not found', { status: 404 });
    }

    
    if (assignedTo === null) {
      const previousEmployeeId = updatedRoom.assignedTo;

  
      if (previousEmployeeId) {
        await Employees.findByIdAndUpdate(
          previousEmployeeId,
          { $pull: { assignedRooms: id } } 
        );
      }
    }

    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    console.error('Error updating room details:', error);
    return new Response('Failed to update room details', { status: 500 });
  }
}

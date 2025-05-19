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

 
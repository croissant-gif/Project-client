import dbConnect from '../../../../utils/dbConnect';
import Rooms from '../../../../models/Rooms';
import CleaningLog from '../../../../models/CleaningLog'; // ✅ ADD THIS LINE

dbConnect();

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
    finishTime,
    schedule_date,
    schedule_start,
    schedule_finish,
    user, // ✅ Capture user from frontend
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
        finishTime,
        schedule_date,
        schedule_start,
        schedule_finish,
      },
      { new: true }
    );

    if (!updatedRoom) {
      return new Response('Room not found', { status: 404 });
    }

    // ✅ Add this block to log cleaning activity
    let logStatus = null;

    if (status === 'CLEANING' && startTime && !finishTime) {
      logStatus = 'STARTED';
    } else if (status !== 'CLEANING' && finishTime) {
      logStatus = 'FINISHED';
    }

if (status === 'CLEANING' && startTime && !finishTime) {
  // ➕ Create a new STARTED log
  await CleaningLog.create({
    roomId: _id,
    roomName: updatedRoom.roomName,
    user: user || 'Unknown',
    status: 'STARTED',
    startTime,
    finishTime: null,
  });
} else if (status !== 'CLEANING' && finishTime) {
  // ✅ Update existing STARTED log to FINISHED
  await CleaningLog.findOneAndUpdate(
    { roomId: _id, status: 'STARTED' }, // Find the in-progress cleaning log
    {
      $set: {
        finishTime,
        status: 'FINISHED',
      },
    },
    { new: true }
  );
}


    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    console.error('Error updating room:', error);
    return new Response('Failed to update room', { status: 500 });
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

import dbConnect from '../../../../utils/dbConnect';
import Employee from '../../../../models/Employee';
import Rooms from '../../../../models/Rooms';

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;

  try {
    await dbConnect();

    // Find employee
    const employee = await Employee.findOne({ username, password }).lean();
    if (!employee) {
      return new Response('Employee not found', { status: 404 });
    }

    // Get rooms assigned to this employee
    const assignedRooms = await Rooms.find({ assignedTo: employee._id }).lean();

    // Merge schedule fields from employee.assignedRooms into the matching rooms
    const mergedRooms = assignedRooms.map((room) => {
      const matchingAssignedRoom = employee.assignedRooms?.find((r) => {
        return r.roomId?.toString() === room._id.toString();
      });

      return {
        ...room,
        schedule_date: matchingAssignedRoom?.schedule_date || null,
        schedule_start: matchingAssignedRoom?.schedule_start || null,
        schedule_finish: matchingAssignedRoom?.schedule_finish || null,
      };
    });

    const employeeData = {
      name: employee.name,
      schedule: employee.schedule,
      assignedRooms: mergedRooms,
    };

    return new Response(JSON.stringify(employeeData), { status: 200 });

  } catch (error) {
    console.error('Error during login:', error);
    return new Response('Error during login', { status: 500 });
  }
}

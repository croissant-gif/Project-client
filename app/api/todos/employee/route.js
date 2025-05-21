import dbConnect from '../../../../utils/dbConnect';
import Employee from '../../../../models/Employee';
import Rooms from '../../../../models/Rooms';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;

  try {
  
    await dbConnect();  
    // Find the employee by username and password
    const employee = await Employee.findOne({ username, password });
    if (!employee) {
      return new Response('Employee not found', { status: 404 });
    }

   
    const assignedRooms = await Rooms.find({ assignedTo: employee._id })
      .select('roomName roomType status arrivalDate departureDate arrivalTime specialRequest startTime finishTime');

    const employeeData = {
      name: employee.name,
      schedule: employee.schedule, 
      assignedRooms,  
    };


    return new Response(JSON.stringify(employeeData), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response('Error during login', { status: 500 });
  }
}

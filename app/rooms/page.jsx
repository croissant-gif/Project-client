'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomSelectionPage() {
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [timing, setTiming] = useState({});  
  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (!username) {
      setMessage("You need to log in first.");
      router.push("/login");
      return;
    }

    const fetchAssignedRooms = async () => {
      try {
        const response = await fetch(`/api/todos/employee`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setAssignedRooms(data.assignedRooms);
          setLoading(false);
        } else {
          setMessage(data.message || 'Failed to fetch rooms.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching assigned rooms:', error);
        setMessage('Error fetching assigned rooms.');
        setLoading(false);
      }
    };

    fetchAssignedRooms();
  }, [router]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const currentDate = new Date();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);
    currentDate.setSeconds(0);
    return currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return <div className="text-center mt-10"><p>Loading...</p></div>;
  }

  return (
    <section className='w-full bg-gray-50  font-montserrat'>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Assigned Rooms</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-lg rounded-2xl m-6">
            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white">
              <tr>
                <th className="px-6 py-3 text-lg font-medium text-left">Room Name</th>
                <th className="px-6 py-3 text-lg font-medium text-left">Room Type</th>
                <th className="px-6 py-3 text-lg font-medium text-left">Room Status</th>
                <th className="px-6 py-3 text-lg font-medium text-left">Arrival Date</th>
                <th className="px-6 py-3 text-lg font-medium text-left">Departure Date</th>
                <th className="px-6 py-3 text-lg font-medium text-left">Arrival Time</th>
                <th className="px-6 py-3 text-lg font-medium text-left">Special Request</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {assignedRooms.length > 0 ? (
                assignedRooms.map((room) => (
                  <tr key={room._id} className="hover:bg-indigo-50 transition duration-300">
                    <td className="px-6 py-4 border-b text-sm font-medium">{room.roomName}</td>
                    <td className="px-6 py-4 border-b text-sm font-medium">{room.roomType}</td>
                    <td className="px-6 py-4 border-b text-sm font-medium">
                      <span className="text-sm">{room.status}</span>
                    </td>
                    <td className="px-6 py-4 border-b text-sm font-medium">{formatDate(room.arrivalDate)}</td>
                    <td className="px-6 py-4 border-b text-sm font-medium">{formatDate(room.departureDate)}</td>
                    <td className="px-6 py-4 border-b text-sm font-medium">{formatTime(room.arrivalTime)}</td>
                    <td className="px-6 py-4 border-b text-sm font-medium">{room.specialRequest}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No rooms assigned</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

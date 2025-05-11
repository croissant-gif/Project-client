'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomSelectionPage() {
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedRoomId, setSelectedRoomId] = useState(null); 
  const [selectedStatus, setSelectedStatus] = useState('CLEANING');
  const [userConditions, setUserConditions] = useState([]); // Track user-added conditions from MongoDB
  const router = useRouter();

  const defaultConditions = [
    'Occupied Clean', 'Occupied Dirty', 'Occupied Ready', 'Vacant Clean', 'Vacant Dirty', 
    'Vacant Ready', 'Check Out', 'No Show', 'Do not Disturb', 'Out of Order', 'Out of Service', 
    'Status Unclear', 'Make up Room', 'Due Out', 'Did Not Check Out', 'House Use', 'Sleep Out'
  ];

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
        const response = await fetch('/api/todos/employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username,password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Retrieve startTime from localStorage and update assignedRooms
          const roomsWithStartTime = data.assignedRooms.map((room) => {
            const storedStartTime = localStorage.getItem(`startTime-${room._id}`);
            return storedStartTime ? { ...room, startTime: storedStartTime } : room;
          });
  
          setAssignedRooms(roomsWithStartTime);
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
  
    const fetchUserConditions = async () => {
      try {
        const response = await fetch('/api/todos/conditions');
        const data = await response.json();
        if (data) {
          setUserConditions(data);  // Update state with conditions from MongoDB
        }
      } catch (error) {
        console.error('Error fetching conditions from MongoDB:', error);
      }
    };
  
    fetchAssignedRooms();
    fetchUserConditions();
  }, [router]);
  

 const handleStatusChange = async (roomId, newStatus, startTime = null, finishTime = null) => {
  try {
    // Update the rooms with new status and startTime
    const updatedRooms = assignedRooms.map((room) =>
      room._id === roomId
        ? { 
            ...room, 
            status: newStatus, 
            startTime: room.startTime || startTime,  // Ensure startTime is set
            finishTime
          }
        : room
    );

    setAssignedRooms(updatedRooms);  // Update state immediately with new data

    const updatedRoom = updatedRooms.find((room) => room._id === roomId);

    // Send the updated room to your backend API to update MongoDB
    const response = await fetch('/api/todos/rooms', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRoom),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update room status');
    }
  } catch (error) {
    console.error('Error updating room status:', error);
  }
};

  
const handleRoomClick = async (roomId) => {
  const isCleaningInProgress = assignedRooms.some(
    (room) => room.status === 'CLEANING' && room._id !== roomId
  );

  if (isCleaningInProgress) {
    alert('You are already cleaning another room. Please finish it first.');
    return;
  }

  if (window.confirm('Are you sure you want to start cleaning this room?')) {
    const startTime = new Date().toISOString();

    setAssignedRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === roomId
          ? { ...room, status: 'CLEANING', startTime, finishTime: null }
          : room
      )
    );

    try {
      const response = await fetch('/api/todos/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: roomId,
          status: 'CLEANING',
          startTime,
          finishTime: null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update room status');
      }

      localStorage.setItem(`startTime-${roomId}`, startTime);
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  }
};


  
  

  const handleFinishCleaning = (roomId) => {
    setSelectedRoomId(roomId);
    setIsModalOpen(true);
  };

  const handleModalApply = () => {
    if (selectedRoomId) {
      const finishTime = new Date().toISOString();
      const selectedRoom = assignedRooms.find((room) => room._id === selectedRoomId);
      const startTime = selectedRoom?.startTime;

      handleStatusChange(selectedRoomId, selectedStatus, startTime, finishTime);
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return <div>Loading...</div>;  
  }

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Your Assigned Rooms</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedRooms.length > 0 ? (
            assignedRooms.map((room) => (
              <div key={room._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl">
                <div className="text-lg font-semibold text-gray-700">{room.roomName}</div>
                <p className="text-sm text-gray-500">Room Type: {room.roomType}</p>
                <p className="text-sm text-gray-500">Arrival: {formatDate(room.arrivalDate)}</p>
                <p className="text-sm text-gray-500">Departure: {formatDate(room.departureDate)}</p>
                <p className="text-sm text-gray-500">Arrival Time: {formatTime(room.arrivalTime)}</p>
                <p className="text-sm text-gray-500">Special Request: {room.specialRequest}</p>

                {room.status === 'CLEANING' ? (
                  <div className="mt-4 text-black">
                    <p>Started Cleaning: {formatTime(room.startTime)}</p>
                    <button
                      onClick={() => handleFinishCleaning(room._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Finish Cleaning
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <button
                      onClick={() => handleRoomClick(room._id)} 
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Start Cleaning
                    </button>
                  </div>
                )}

                {room.finishTime && (
                  <div className="mt-4 text-black">
                    <p>Start Time: {formatTime(room.startTime)}</p>
                    <p>Finish Time: {formatTime(room.finishTime)}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No rooms assigned</div>
          )}
        </div>
      </div>

      {/* Modal for changing status */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-black">Select Room Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
            >
              <option value="CLEANING">Cleaning...</option>
              {/* Render both default and user conditions */}
              {defaultConditions.map((condition, index) => (
                <option key={index} value={condition}>
                  {condition}
                </option>
              ))}
              {userConditions.map((condition, index) => (
                <option key={index} value={condition.name || condition}>
                  {condition.name || condition}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleModalApply}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoomSelectionPage() {
  const [assignedRooms, setAssignedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [inventories, setInventories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 

  // Default preset items
  const presetItems = [
    { name: 'Towel', quantity: 1 },
    { name: 'Soap', quantity: 1 },
    { name: 'Shampoo', quantity: 1 },
  ];

  const router = useRouter();



  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (!username) {
      setMessage('You need to log in first.');
      router.push('/login');
      return;
    }

    const fetchAssignedRooms = async () => {
      try {
        const response = await fetch(`/api/todos/employee`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username,password }),
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

  useEffect(() => {
    if (!selectedRoom) return;

    const fetchInventories = async () => {
      const roomId = selectedRoom._id;

      try {
        const response = await fetch(`/api/todos/roomitems?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          const updatedInventories = inventories.filter(
            (inventory) => inventory.roomId !== selectedRoom._id
          );
          updatedInventories.push({ roomId: selectedRoom._id, inventory: data });
          setInventories(updatedInventories);
          localStorage.setItem('inventories', JSON.stringify(updatedInventories));
        }
      } catch (error) {
        console.error('Failed to fetch inventories', error);
      }
    };

    fetchInventories();
  }, [selectedRoom]);

  

  // Calculate inventory items to display based on pagination
  const inventoryItems = inventories
    .find((room) => room.roomId === selectedRoom?._id)?.inventory || [];

  const paginatedInventoryItems = inventoryItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(inventoryItems.length / itemsPerPage);

  // Pagination buttons
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  return (
    <section className="w-full bg-white  font-montserrat">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Room Items</h1>
  
        {/* Room Selection Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Select a Room</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-black">
            {assignedRooms.length > 0 ? (
              assignedRooms.map((room) => (
                <div
                  key={room._id}
                  className={`p-4 border rounded-md cursor-pointer flex items-center justify-center ${
                    selectedRoom && selectedRoom._id === room._id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                  onClick={() => {
                    
                    if (selectedRoom && selectedRoom._id === room._id) {
                      setSelectedRoom(null);  
                    } else {
                      setSelectedRoom(room);  
                    }
                  }}
                >
                  <span className="text-lg font-semibold">{room.roomName}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No rooms available</p>
            )}
          </div>
        </div>
  
        {/* Display Inventory if a room is selected */}
        {selectedRoom && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Items for {selectedRoom.roomName}</h2>
            <ul className="space-y-4">
              {paginatedInventoryItems.map((inventory, index) => (
                <li key={index} className="p-4 border rounded-md shadow-md">
                  <h3 className="text-xl font-semibold text-black">{inventory.name}</h3>
                  <p className="text-gray-600">Quantity: {inventory.quantity}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Pagination */}
        {selectedRoom && (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={prevPage}
              className="p-2 bg-gray-500 text-white rounded"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              className="p-2 bg-gray-500 text-white rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
  
}  
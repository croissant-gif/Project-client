'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
  const [fullName, setFullName] = useState('');
  const [schedule, setSchedule] = useState('');
  const router = useRouter(); // To navigate programmatically
  const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state

  useEffect(() => {
    // Get the stored full name from localStorage
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setFullName(storedName); // Set the name state
    }

    // Fetch employee schedule
    const fetchEmployeeSchedule = async () => {
      try {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        
        if (username && password) {
          const response = await fetch('/api/todos/employee', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await response.json();
          if (response.ok) {
            setSchedule(data.schedule || 'No schedule available'); // Set employee schedule
          } else {
            setSchedule('Schedule not available');
          }
        }
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        setSchedule('Error fetching schedule');
      }
    };

    fetchEmployeeSchedule();
  }, []);

  const handleLogout = () => {
    // Clear the localStorage to remove the username and name
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('name');
    
    // Redirect to the login page
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the sidebar state
  };  
  return (
    <section className="flex h-screen  font-montserrat">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-blue-500 to-blue-300 h-screen shadow-lg ${isCollapsed ? 'w-20' : 'w-60'} transform transition-width duration-300 ease-in-out`}>
         {/* Title at Top */}
         <div className={`px-3 py-2 w-full transition-all duration-300 flex justify-center ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
          <h1 className="text-white font-normal text-sm text-center">
            HOUSEKEEPING MANAGEMENT SYSTEM
          </h1>
         </div>
         <div className="px-4 py-5">
        
     {/* Hamburger Button to toggle sidebar */}
     <div className="w-full flex justify-start px-4 pt-1">
     <button 
      onClick={toggleSidebar} 
      className="text-white text-xl focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V5.25zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V11.25zm0 6a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V17.25z" clipRule="evenodd" />
      </svg>
     </button>
  </div>


  {/* Admin Label */}
  <div className={`px-4 py-2 w-full text-white text-lg text-center font-semibold transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
    STAFF
  </div>
</div>

        <div className={`px-7 py-3 text-white text-lg font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>
          {fullName ? `Hello, ${fullName}` : 'Hello, Guest'}
        </div>
        <div className={`flex flex-col ${isCollapsed ? 'space-y-3' : 'space-y-5'}`}>
          {/* Links */}
          <Link href="/rooms">
            <div className='flex items-center px-6 py-3 text-white font-semibold hover:bg-blue-300 transition duration-300'>
              <svg className="w-5 h-5 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
                <path fillRule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clipRule="evenodd" />
              </svg>
              <span className={` ${isCollapsed ? 'hidden' : 'block'}`}>ASSIGNED ROOMS</span>
            </div>
          </Link>
          {/* More Links */}
          <Link href="/roomcleaning">
            <div className='flex items-center px-6 py-3 text-white font-semibold hover:bg-blue-300 transition duration-300'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mx-2">
                <path d="M12 11.993a.75.75 0 0 0-.75.75v.006c0 .414.336.75.75.75h.006a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75H12ZM12 16.494a.75.75 0 0 0-.75.75v.005c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H12ZM8.999 17.244a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.006ZM7.499 16.494a.75.75 0 0 0-.75.75v.005c0 .414.336.75.75.75h.005a.75.75 0 0 0 .75-.75v-.005a.75.75 0 0 0-.75-.75H7.5ZM13.499 14.997a.75.75 0 0 1 .75-.75h.006a.75.75 0 0 1 .75.75v.005a.75.75 0 0 1-.75.75h-.006a.75.75 0 0 1-.75-.75v-.005ZM14.25 16.494a.75.75 0 0 0-.75.75v.006c0 .414.335.75.75.75h.005a.75.75 0 0 0 .75-.75v-.006a.75.75 0 0 0-.75-.75h-.005ZM15.75 14.995a.75.75 0 0 1 .75-.75h.005a.75.75 0 0 1 .75.75v.006a.75.75 0 0 1-.75.75H16.5a.75.75 0 0 1-.75-.75v-.006ZM13.498 12.743a.75.75 0 0 1 .75-.75h2.25a.75.75 0 1 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM6.748 14.993a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z" />
                <path fillRule="evenodd" d="M18 2.993a.75.75 0 0 0-1.5 0v1.5h-9V2.994a.75.75 0 1 0-1.5 0v1.497h-.752a3 3 0 0 0-3 3v11.252a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3V7.492a3 3 0 0 0-3-3H18V2.993ZM3.748 18.743v-7.5a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-13.5a1.5 1.5 0 0 1-1.5-1.5Z" clipRule="evenodd" />
              </svg>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>ROOM CLEANING</span>
            </div>
          </Link>
          
          <Link href="roomitems">
            <div className='flex items-center px-6 py-3 text-white font-semibold hover:bg-blue-300 transition duration-300'>
            <svg className="w-5 h-5 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
              <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
              <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
            </svg>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>ROOM ITEMS</span>
            </div>
          </Link>
       
          {/* LOGOUT Button */}
          <div 
            onClick={handleLogout} 
            className='flex items-center px-6 py-3 text-white font-semibold hover:bg-blue-300 transition duration-300 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
            </svg>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>LOG OUT</span>
          </div>
         
             {/* Display Schedule */}
          <div className={`px-6 py-3 text-white font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>
            <h3>Your Shift:</h3>
            <p>{schedule}</p>
          </div>



        </div>
      </div>
 
    
    
    </section>
  );
  
  };

  
  export default Sidebar;
  





    


'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      // If logged in, redirect to the dashboard
      router.push('/rooms');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Reset message before submitting

    const credentials = { username, password };

    try {
      const response = await fetch('/api/todos/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
      
        const { name } = data; 

        // Store the username and name in localStorage
        localStorage.setItem("username", username); 
        localStorage.setItem("name", name); 
        localStorage.setItem("password", password);

        router.push("/rooms");
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("Wrong credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <section className="w-full">
      <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-300 to-blue-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 max-w-sm">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Employee Login</h2>
          {message && <div className="mb-4 text-center text-lg font-semibold text-red-600">{message}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-full py-3 mt-4 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>


        </div>
      </section>
    </section>
  );
}

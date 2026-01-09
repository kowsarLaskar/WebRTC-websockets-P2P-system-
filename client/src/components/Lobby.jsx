import { useSocket } from '@/context/SocketProvider';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import Image from 'next/image';
import { motion } from 'framer-motion';

const LobbyScreen = () => {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const socket = useSocket();
  const router = useRouter();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit('room:join', { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    ({ room }) => {
      router.push(`/room/${room}`);
    },
    [router]
  );

  useEffect(() => {
    socket.on('room:join', handleJoinRoom);
    return () => socket.off('room:join', handleJoinRoom);
  }, [socket, handleJoinRoom]);

  const particlesInit = async (main) => {
  try {
    await loadFull(main);
  } catch (err) {
    console.error('loadFull failed:', err);
  }
};



  const rootClasses = darkMode
    ? 'relative h-screen bg-gray-900 text-white transition-all duration-300'
    : 'relative h-screen bg-gray-50 text-gray-900 transition-all duration-300';

  return (
    <div className={rootClasses}>
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-10">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="App Logo" width={40} height={40} />
          <h1 className="text-2xl md:text-4xl font-bold font-josefin tracking-tight">
            Video<span className="text-green-500">Peers</span>
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={
            'px-3 py-1 rounded-md font-medium transition ' +
            (darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-900 shadow')
          }
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* MAIN */}
      <main className="absolute inset-0 pt-16 w-full flex items-center justify-center">
        {/* Background particles canvas */}
        <Particles
          id="tsparticles"
          className="absolute inset-0 w-full h-full -z-10"
          init={particlesInit}
          options={{
            background: { color: { value: darkMode ? '#111827' : '#f9fafb' } },
            fpsLimit: 60,
            interactivity: {
              events: {
                onClick: { enable: true, mode: 'push' },
                onHover: { enable: true, mode: 'repulse' },
                resize: true,
              },
              modes: { push: { quantity: 4 }, repulse: { distance: 100, duration: 0.4 } },
            },
            particles: {
              color: { value: '#00ff00' },
              links: { color: '#00ff00', distance: 150, enable: true, opacity: 0.5, width: 1 },
              collisions: { enable: true },
              move: { enable: true, speed: 1, outModes: 'bounce' },
              number: { density: { enable: true, area: 800 }, value: 80 },
              opacity: { value: 0.5 },
              shape: { type: 'circle' },
              size: { value: { min: 1, max: 5 } },
            },
            detectRetina: true,
          }}
        />

        {/* Content wrapper */}
        <div className="relative max-w-md w-full px-4 mx-auto space-y-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-lg"
          >
            Peer-to-Peer video calls, powered by{' '}
            <span className="font-semibold">WebRTC</span>!<br />
            <span className="text-sm">Bring People Closer Together.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={
              'p-8 rounded-2xl shadow-lg backdrop-blur-lg transition ' +
              (darkMode ? 'bg-gray-800' : 'bg-white')
            }
          >
            <form onSubmit={handleSubmitForm} className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="email"
                  className={
                    'block text-sm font-medium mb-1 ' +
                    (darkMode ? 'text-gray-200' : 'text-gray-700')
                  }
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ' +
                    (darkMode
                      ? 'bg-gray-900 text-white border-gray-700 focus:ring-green-500'
                      : 'bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400')
                  }
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="room"
                  className={
                    'block text-sm font-medium mb-1 ' +
                    (darkMode ? 'text-gray-200' : 'text-gray-700')
                  }
                >
                  Room Number
                </label>
                <input
                  type="number"
                  id="room"
                  required
                  value={room}
                  autoComplete="off"
                  onChange={(e) => setRoom(e.target.value)}
                  className={
                    'w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ' +
                    (darkMode
                      ? 'bg-gray-900 text-white border-gray-700 focus:ring-green-500'
                      : 'bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-400')
                  }
                  placeholder="Enter Room ID"
                />
              </div>

              <button
                type="submit"
                className={
                  'w-full font-semibold py-2 rounded-md transition duration-200 ' +
                  (darkMode
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white')
                }
              >
                Join Room
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LobbyScreen;

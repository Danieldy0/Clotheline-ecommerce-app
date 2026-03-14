import React, { useState, useEffect } from 'react'
import Form from '../components/Utils/Form2'
import { HomeIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { Switch } from "@headlessui/react";

const Signin = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen dark:bg-black transition-colors duration-300">
      {/* Content sits above the overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="p-4 flex justify-between items-center">
          <a href="/">
            <HomeIcon className="w-6 h-6 text-black dark:text-white" />
          </a>
          {/* Toggle Switch */}
          <div className="flex items-center gap-3">

            {darkMode ? (
              <SunIcon className="w-5 h-5 text-white" />
            ) : (
              <MoonIcon className="w-5 h-5 text-black" />
            )}

            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${darkMode ? "bg-white" : "bg-gray-400"
                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${darkMode ? "translate-x-6 bg-black" : "translate-x-1 bg-white"
                  } inline-block h-4 w-4 transform rounded-full transition`}
              />
            </Switch>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-black dark:text-white drop-shadow">Sign In Page</h1>
          <Form />
          <p className="text-sm text-black/80 dark:text-white/80">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin
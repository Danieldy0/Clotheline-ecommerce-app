import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { HomeIcon, MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { Switch } from "@headlessui/react";
import Profile from './Utils/Profile'
import Pop from './Utils/NavPop'
import Pop2 from './Utils/NavPop2'
import Search from './Utils/Search'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* HIDDEN CHECKBOX — controls hamburger state globally. Fixed positioning prevents jumping to the top of the page. */}
      <input id="menu_toggle" type="checkbox" className="peer sr-only fixed" />

      {/* BACKDROP WHEN MENU OPEN — Outside of scrolling blur div */}
      <label
        htmlFor="menu_toggle"
        className="fixed inset-0 bg-black/60 opacity-0 peer-checked:opacity-100 pointer-events-none peer-checked:pointer-events-auto transition-opacity duration-300 z-[55] md:hidden"
      />

      {/* MOBILE SLIDE-IN MENU — Outside of scrolling blur div to prevent unexpected blurring */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-black shadow-xl transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 z-[60] p-6 md:hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
          <label
            htmlFor="menu_toggle"
            className="cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </label>
        </div>
        <nav className="flex flex-col space-y-4 text-gray-800 dark:text-white">
          <a href="/" className="hover:text-gray-900 transition-colors dark:hover:text-white">Home</a>
          <Pop2 />
          <a href="#about" className="hover:text-gray-400 transition-colors dark:hover:text-white" onClick={(e) => e.preventDefault()}>About</a>
          <a href="/" className="hover:text-gray-400 transition-colors dark:hover:text-white" onClick={(e) => e.preventDefault()}>Contact</a>
        </nav>
        <br />
        <hr className="border-gray-200 dark:border-gray-800" />
        <br />
        <Search />
      </div>

      {/* MAIN NAVBAR — This div handles the scroll blur/transparency */}
      <div
        className={`flex items-center justify-between fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${scrolled
          ? 'bg-white/45 dark:bg-black/45 backdrop-blur-md shadow-md text-white'
          : 'bg-transparent text-white'
          }`}
      >

        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold tracking-wide text-black dark:text-white">
            Clothline.
          </h1>
          {/* Hamburger toggle — triggers the global checkbox */}
          <label htmlFor="menu_toggle" className="md:hidden cursor-pointer flex flex-col gap-1">
            <span className={`h-0.5 w-6 transition-all ${scrolled ? 'bg-gray-500' : 'bg-gray-500'}`}></span>
            <span className={`h-0.5 w-6 transition-all ${scrolled ? 'bg-gray-500' : 'bg-gray-500'}`}></span>
            <span className={`h-0.5 w-6 transition-all ${scrolled ? 'bg-gray-500' : 'bg-gray-500'}`}></span>
          </label>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center">
          <ul className="flex items-center gap-6 font-medium text-black dark:text-white">
            <li><a href="/" className="hover:opacity-70 transition-opacity">Home</a></li>
            <li><Pop /></li>
            <li><a href="#about" className="hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="/" className="hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </div>

        {/* RIGHT ICONS — desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <Search />
          {/* Toggle Switch */}
          <div className="flex items-center gap-3">

            {darkMode ? (
              <SunIcon className="w-5 h-5 text-white dark:text-white" />
            ) : (
              <MoonIcon className="w-5 h-5 text-black dark:text-black" />
            )}

            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${darkMode ? "bg-white" : "bg-gray-400"
                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${darkMode ? "translate-x-6 bg-black" : "translate-x-1 bg-white dark:bg-black"
                  } inline-block h-4 w-4 transform rounded-full transition`}
              />
            </Switch>
          </div>
          <Profile scrolled={scrolled} />


        </div>

        {/* RIGHT ICONS — mobile */}
        <div className="flex md:hidden gap-4 items-center">
          {/* Toggle Switch */}
          <div className="flex items-center gap-3">

            {darkMode ? (
              <SunIcon className="w-5 h-5 text-white dark:text-white" />
            ) : (
              <MoonIcon className="w-5 h-5 text-black dark:text-white" />
            )}

            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${darkMode ? "bg-white" : "bg-gray-400"
                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${darkMode ? "translate-x-6 bg-black" : "translate-x-1 bg-white dark:bg-black"
                  } inline-block h-4 w-4 transform rounded-full transition`}
              />
            </Switch>
          </div>
          <Profile scrolled={scrolled} />
        </div>
      </div>
    </>
  )
}

export default Header

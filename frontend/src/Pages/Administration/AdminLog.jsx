import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from "@/components/login-form"
import { HomeIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Switch } from "@headlessui/react";
import bgImage from '../../assets/admin-bg.jpg'

const AdminLog = () => {
    const navigate = useNavigate()

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const user = localStorage.getItem('currentUser')
        if (user) {
            navigate('/administration')
        }
    }, [navigate])

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
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10 dark:bg-black">
                <div className="flex items-center gap-3 justify-between">
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
                <div className="flex flex-1 flex-col items-center justify-center dark:bg-black">
                    <h1 className="text-3xl font-bold text-black dark:text-white">
                        Admin Login
                    </h1>
                    <div className="w-full max-w-xs max-h-full mt-4">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src={bgImage}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    )
}

export default AdminLog
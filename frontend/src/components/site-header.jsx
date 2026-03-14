import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HomeIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Switch } from "@headlessui/react";

export function SiteHeader() {
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
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1 text-black dark:text-white" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <h1 className="text-sm md:text-base font-medium text-black dark:text-white">Documents</h1>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3 px-4 lg:px-6">
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
        </header>
    )
}

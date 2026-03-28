import React from 'react'
import Img from '../assets/minimalism.jpg';

const MinimalismHero = () => {
    return (
        <div>
            <div className="relative w-full h-[90vh] bg-white dark:bg-black group overflow-hidden">
                {/* Hero Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={Img}
                        alt="The New Minimalism"
                        className="w-full h-full object-cover object-top"
                    />
                    {/* Subtle overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="flex flex-col space-y-8 items-center text-center px-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white dark:text-white leading-tight uppercase tracking-tighter drop-shadow-sm">
                            The New Minimalism.
                        </h1>

                        <p className="text-lg md:text-xl text-white dark:text-gray-200 max-w-2xl leading-relaxed">
                            Curated Essentials for the Modern Wardrobe.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MinimalismHero

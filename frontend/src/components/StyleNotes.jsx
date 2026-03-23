import React from 'react';

const StyleNotes = () => {
    return (
        <section className="bg-white dark:bg-black pb-24">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="relative aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <img
                            src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop"
                            alt="Monochrome style"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    </div>
                    <div className="max-w-md mx-auto md:mx-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 block mb-6">
                            STYLE NOTES:
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extralight text-gray-900 dark:text-white mb-8 tracking-tighter uppercase leading-tight">
                            THE MONOCHROME EDIT
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10 font-sans italic">
                            Lorem ipsum dolor sit amet, nulla consectetuer adipiscing elit, sed do eiusmod tempor incididunt ut laboum ut mam secitant enillam liborad and color venlutgous ut timm.
                        </p>
                        <a
                            href="#"
                            className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-gray-900 dark:text-white border-b border-black dark:border-white pb-1 transition-colors hover:text-gray-400 dark:hover:text-gray-500 italic"
                        >
                            READ MORE
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StyleNotes;

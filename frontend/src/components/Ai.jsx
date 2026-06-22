import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sparkles,
    X,
    Send,
    Search,
    Shirt,
    Palette,
    Ruler,
    ArrowUpRight,
    Bot,
    User
} from "lucide-react";

const Ai = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: "Hello! I'm your Clotheline Shopping Assistant. How can I help you find the perfect outfit today?"
        }
    ]);
    const [input, setInput] = useState('');

    const suggestions = [
        { icon: Search, label: "Show me floral dresses" },
        { icon: Shirt, label: "Latest in men's fashion" },
        { icon: Palette, label: "Outfits for a summer wedding" },
        { icon: Ruler, label: "Help me find my size" }
    ];

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { id: Date.now(), role: 'user', content: input };
        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate assistant response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "That sounds like a great choice! I'm scanning our latest premium collection for something that matches that description. Would you like to see some initial recommendations?"
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="group relative flex items-center gap-0 hover:gap-3 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full font-medium transition-all duration-500 shadow-2xl hover:bg-neutral-800 dark:hover:bg-neutral-200 overflow-hidden">
                        <Sparkles className="w-6 h-6 text-blue-400 shrink-0" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 whitespace-nowrap text-sm tracking-wide">
                            Start Styling Session
                        </span>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                </DialogTrigger>

                <DialogContent className="fixed bottom-[110px] right-6 left-auto top-30 translate-x-0 translate-y-0 sm:translate-x-0 sm:translate-y-0 w-[calc(100%-3rem)] sm:w-[440px] h-[75vh] flex flex-col p-0 gap-0 overflow-hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-gray-200 dark:border-neutral-800 rounded-[2.5rem] shadow-2xl 
                    {/* Entry Animations */}
                    data-[state=open]:animate-in
                    data-[state=open]:fade-in-0
                    data-[state=open]:slide-in-from-bottom-12
                    data-[state=open]:duration-300
                    data-[state=open]:ease-out

                    {/* Exit Animations */}
                    data-[state=closed]:animate-out
                    data-[state=closed]:fade-out-0
                    data-[state=closed]:slide-out-to-bottom-12
                    data-[state=closed]:duration-300" >

                    {/* Dialog Header */}
                    <div className="p-8 pb-4 flex justify-between items-start border-b border-gray-100 dark:border-neutral-900">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center shadow-xl">
                                <Sparkles className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Clotheline Assistant</DialogTitle>
                                <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    AI Stylist is Active
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-hide">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-3xl ${msg.role === 'user'
                                    ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none'
                                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white rounded-tl-none'
                                    }`}>
                                    <p className="text-[15px] leading-relaxed font-light">{msg.content}</p>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 px-1">
                                    {msg.role === 'assistant' ? 'Stylist' : 'You'} · JUST NOW
                                </span>
                            </div>
                        ))}

                        {/* Suggestion Grid */}
                        {messages.length === 1 && (
                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Choose a starting point</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {suggestions.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setInput(item.label);
                                                // We'll let the user click send or just auto-send? Auto-send is nice.
                                                // I'll just set the input for now to avoid complexity in this snippet.
                                            }}
                                            className="flex items-center gap-3 p-4 bg-white dark:bg-neutral-800 rounded-2xl text-left hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group border border-gray-100 dark:border-neutral-700 shadow-sm"
                                        >
                                            <item.icon className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-8 pt-4 bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-900">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 pl-6 pr-16 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
                                placeholder="Describe the look you're going for..."
                                type="text"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </form>
                        <div className="flex justify-center mt-4">
                            <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" />
                                Style preferences are curated by Clotheline AI
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Ai;
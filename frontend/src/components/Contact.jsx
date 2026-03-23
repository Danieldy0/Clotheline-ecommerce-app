import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";

const Contact = () => {
    return (
        <section id="contact" className="scroll-mt-20 py-24 bg-white dark:bg-black overflow-hidden relative transition-colors duration-500">
            <div className="mx-20 px-6 relative z-10">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-block relative mb-4">
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500">
                            Contact
                        </span>
                        <div className="h-[2px] w-8 bg-gray-400 dark:bg-gray-600 mx-auto mt-2"></div>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white mb-8 tracking-tight">
                        Let's Connect
                    </h2>
                    <p className="max-w-3xl mx-auto text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                        Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: Info */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-1000">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Let's Connect
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">
                                We're here to discuss your vision and explore how we can bring it to life together.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5 group">
                                <div className="mt-1 flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
                                    <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                                        Email Us
                                    </p>
                                    <p className="text-gray-900 dark:text-white font-medium">contact@example.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="mt-1 flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
                                    <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                                        Call Us
                                    </p>
                                    <p className="text-gray-900 dark:text-white font-medium">+1 (555) 432-8976</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="mt-1 flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors duration-300">
                                    <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">
                                        Visit Us
                                    </p>
                                    <p className="text-gray-900 dark:text-white font-medium leading-relaxed">
                                        547 Madison Avenue<br />New York, NY 10022
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="animate-in fade-in slide-in-from-right-4 duration-1000">
                        <Card className="border-none shadow-2xl shadow-gray-200/50 dark:shadow-none dark:bg-[#0a0a0a]">
                            <CardContent className="p-8 md:p-12">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                    Send us a message
                                </h3>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="full-name" className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Full Name</Label>
                                            <Input
                                                id="full-name"
                                                placeholder="John Doe"
                                                className="h-12 bg-gray-50/50 border-gray-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-gray-400 placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                className="h-12 bg-gray-50/50 border-gray-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-gray-400 placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Subject</Label>
                                        <Input
                                            id="subject"
                                            placeholder="How can we help?"
                                            className="h-12 bg-gray-50/50 border-gray-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-gray-400 placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Your message here..."
                                            className="min-h-[150px] bg-gray-50/50 border-gray-100 dark:bg-gray-900 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-gray-400 placeholder:text-gray-400 resize-none"
                                        />
                                    </div>

                                    <Button className="w-full sm:w-auto h-12 px-8 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all duration-300 font-bold flex items-center justify-center gap-2 group">
                                        Send Message
                                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gray-50 dark:bg-gray-900/20 -z-0 rounded-bl-full opacity-50"></div>
        </section>
    );
};

export default Contact;

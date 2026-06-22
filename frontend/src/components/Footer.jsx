import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        usefulLinks: [
            { name: "Home", path: "/" },
            { name: "About us", path: "/about" },
            { name: "Collection", path: "/collection" },
            { name: "Terms of service", path: "/terms" },
            { name: "Privacy policy", path: "/privacy" }
        ],
        ourServices: [
            { name: "Men's Fashion", path: "/category/men" },
            { name: "Women's Style", path: "/category/women" },
            { name: "Premium Collection", path: "/category/premium" },
            { name: "Gift Cards", path: "/gift-cards" },
            { name: "Order Tracking", path: "/orders" }
        ]
    };

    return (
        <footer className="bg-black text-white pt-24 pb-12 px-12 border-t border-neutral-900">
            <div className="mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-neutral-900 pb-20">

                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight mb-8">Clotheline</h2>
                            <p className="text-neutral-400 leading-relaxed font-light text-base max-w-sm">
                                Elevating your everyday wardrobe with premium essentials. Crafted for those who appreciate the finer details in modern fashion.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { Icon: Twitter, label: 'X (Twitter)' },
                                { Icon: Facebook, label: 'Facebook' },
                                { Icon: Instagram, label: 'Instagram' },
                                { Icon: Linkedin, label: 'LinkedIn' }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="w-10 h-10 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-300 group"
                                    aria-label={social.label}
                                >
                                    <social.Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-10">Useful Links</h3>
                        <ul className="space-y-5">
                            {footerLinks.usefulLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="text-neutral-400 hover:text-white text-base font-light transition-colors duration-200 block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Our Services */}
                    <div>
                        <h3 className="text-xl font-semibold mb-10">Collections</h3>
                        <ul className="space-y-5">
                            {footerLinks.ourServices.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.path}
                                        className="text-neutral-400 hover:text-white text-base font-light transition-colors duration-200 block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="space-y-10">
                        <h3 className="text-xl font-semibold mb-10">Contact Us</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-5 group">
                                <MapPin className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                                <div className="text-neutral-400 text-base font-light leading-relaxed">
                                    A108 Adam Street<br />
                                    New York, NY 535022<br />
                                    United States
                                </div>
                            </div>
                            <div className="flex items-center gap-5 group">
                                <Phone className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                                <span className="text-neutral-400 text-base font-light">+1 5589 55488 55</span>
                            </div>
                            <div className="flex items-center gap-5 group">
                                <Mail className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                                <span className="text-neutral-400 text-base font-light">info@clotheline.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 text-center space-y-4">
                    <p className="text-neutral-500 text-xs font-light tracking-wide">
                        © Copyright <span className="font-semibold text-neutral-300">Clotheline</span> All Rights Reserved
                    </p>
                    <div className="text-[10px] text-neutral-600 uppercase tracking-widest">
                        Designed for premium excellence
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

interface NavigationMenuProps {
    logoText?: string
    links?: { name: string; href: string }[]
    signInText?: string
    signUpText?: string
}

const NavigationMenu = ({
    logoText = "CosmoSafe",
    links = [
        { name: "Home", href: "/" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Contact", href: "#contact" },
    ],
    signInText = "Sign In",
    signUpText = "Sign Up",
}: NavigationMenuProps = {}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center px-4 py-4">
            <div className="flex items-center justify-between px-6 py-3 
        bg-background/70 backdrop-blur-md border border-border 
        rounded-full shadow-lg w-full max-w-6xl relative">

                {/* Center Logo */}
                <div className="flex items-center justify-center flex-1  md:flex-none">
                    <motion.div
                        className="flex items-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-8 h-8 mr-2 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">L</span>
                        </div>
                        <span className="text-lg font-bold text-foreground">{logoText}</span>
                    </motion.div>
                </div>

                {/* Left Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <a
                                href={link.href}
                                className="text-sm text-foreground hover:text-muted-foreground transition-colors font-medium"
                            >
                                {link.name}
                            </a>
                        </motion.div>
                    ))}
                </nav>



                {/* Right Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <a
                            href="/signin"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm text-foreground hover:text-muted-foreground transition-colors font-medium"
                        >
                            {signInText}
                        </a>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <a
                            href="/signup"
                            className="inline-flex items-center justify-center px-5 py-2 text-sm text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors font-medium"
                        >
                            {signUpText}
                        </a>
                    </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    className="md:hidden flex items-center"
                    onClick={toggleMenu}
                    whileTap={{ scale: 0.9 }}
                >
                    <Menu className="h-6 w-6 text-foreground" />
                </motion.button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-background z-50 pt-24 px-6 md:hidden"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <motion.button
                            className="absolute top-6 right-6 p-2"
                            onClick={toggleMenu}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X className="h-6 w-6 text-foreground" />
                        </motion.button>

                        <div className="flex flex-col space-y-6">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.1 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <a
                                        href={link.href}
                                        className="text-base text-foreground font-medium"
                                        onClick={toggleMenu}
                                    >
                                        {link.name}
                                    </a>
                                </motion.div>
                            ))}

                            {/* Auth Buttons for Mobile */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="pt-6 space-y-4"
                            >
                                <a
                                    href="/signin"
                                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-foreground border border-border rounded-full hover:bg-accent transition-colors font-medium"
                                    onClick={toggleMenu}
                                >
                                    {signInText}
                                </a>
                                <a
                                    href="/signup"
                                    className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors font-medium"
                                    onClick={toggleMenu}
                                >
                                    {signUpText}
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NavigationMenu

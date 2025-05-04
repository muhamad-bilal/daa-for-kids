"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
        document.documentElement.classList.toggle("dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    )
} 
"use client"

import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { LayoutGrid } from "lucide-react"

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <LayoutGrid className="h-6 w-6 text-fuchsia-500" />
                    <span className="font-bold text-lg">daa for kids</span>
                </Link>
                <ThemeToggle />
            </div>
        </header>
    )
} 
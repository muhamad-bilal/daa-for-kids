import { motion, type MotionProps, type Variants } from "framer-motion";
import { useState } from "react";

const menu = {
    closed: {
        scale: 0,
        transition: {
            delay: 0.15,
        },
    },
    open: {
        scale: 1,
        transition: {
            type: "spring",
            duration: 0.4,
            delayChildren: 0.2,
            staggerChildren: 0.05,
        },
    },
} satisfies Variants;

const item = {
    variants: {
        closed: { x: -16, opacity: 0 },
        open: { x: 0, opacity: 1 },
    },
    transition: { opacity: { duration: 0.2 } },
} satisfies MotionProps;

interface MenuProps {
    label: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
    animate?: string;
    initial?: string;
    exit?: string;
    variants?: Variants;
}

export function Menu({ label, open, setOpen, children, animate, initial, exit, variants }: MenuProps) {
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-full p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-left"
            >
                {label}
            </button>
            {open && (
                <motion.div
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700"
                    animate={animate}
                    initial={initial}
                    exit={exit}
                    variants={variants}
                >
                    {children}
                </motion.div>
            )}
        </div>
    );
}

export function MenuItem({ children, onClick, ...props }: MotionProps & { children: React.ReactNode; onClick?: () => void }) {
    return (
        <motion.div
            className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
} 
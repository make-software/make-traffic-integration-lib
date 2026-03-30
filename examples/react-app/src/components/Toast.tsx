import React from "react";

export type ToastColor = "green" | "red" | "amber";

export interface ToastProps {
    /** Visual intent of the notification. */
    color?: ToastColor;
    children: React.ReactNode;
}

const COLOR_CLASS: Record<ToastColor, string> = {
    green: "bg-green-500/90",
    red:   "bg-red-500/90",
    amber: "bg-amber-500/90",
};

/**
 * Fixed notification pill anchored to the top-centre of the viewport.
 * Rendered by the caller only when there is a message to show;
 * auto-dismiss logic lives in the parent component.
 */
const Toast: React.FC<ToastProps> = ({ color = "green", children }) => (
    <div
        className={`
            fixed top-6 left-1/2 -translate-x-1/2 z-[1000]
            flex items-center gap-2
            px-4 py-2.5 rounded-xl shadow-lg
            text-white text-sm font-medium whitespace-nowrap
            ${COLOR_CLASS[color]}
        `}
    >
        {children}
    </div>
);

export default Toast;

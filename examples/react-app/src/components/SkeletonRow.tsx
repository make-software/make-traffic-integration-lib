import React from "react";

/**
 * Animated placeholder row shown while the task list is loading.
 * Matches the layout of TaskRow so the transition is seamless.
 */
const SkeletonRow: React.FC = () => (
    <li className="flex items-center gap-3 px-4 py-3 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-zinc-700 rounded w-2/3" />
            <div className="h-2.5 bg-zinc-800 rounded w-1/4" />
        </div>
        <div className="h-7 w-14 bg-zinc-700 rounded-full shrink-0" />
    </li>
);

export default SkeletonRow;

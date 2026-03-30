import React from "react";
import { Task } from "make-traffic-integration-core";
import { getRewardValue, getTaskIconUrl } from "make-traffic-integration-react-wrapper";

export interface TaskRowProps {
    task: Task;
    /** Base URL for icon assets — e.g. "/icons" or "https://cdn.example.com/assets". */
    assetsUrl: string;
    /** Called when the user clicks the Go button (starts the task). */
    onGo: () => void;
    /** Called when the user clicks the Claim button (claims the reward). */
    onClaim: () => void;
}

/**
 * Single row in the task list.
 *
 * Layout: [icon] [name + rewards] [action button]
 *
 * Action button states:
 *  - "Go →"   task not yet started
 *  - "Claim"  task completed, reward available to claim
 *  - "Done ✓" reward already claimed (isRewarded)
 */
const TaskRow: React.FC<TaskRowProps> = ({ task, assetsUrl, onGo, onClaim }) => {
    const coins  = getRewardValue(task.rewards, "coin");
    const energy = getRewardValue(task.rewards, "energy");
    const isDone = task.userState.isRewarded;

    return (
        <li className={`flex items-center gap-3 px-4 py-3 transition-opacity ${isDone ? "opacity-80" : ""}`}>

            {/* Task icon — falls back to www.svg when customMetadata.icon is not set */}
            <img
                src={getTaskIconUrl(task, assetsUrl)}
                alt=""
                className="w-8 h-8 rounded-full shrink-0 bg-zinc-700 object-cover"
            />

            {/* Name + reward amounts */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{task.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    {coins > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-amber-400">
                            <img src={`${assetsUrl}/gold.png`} alt="coin" className="w-3.5 h-3.5" />
                            +{coins}
                        </span>
                    )}
                    {energy > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-sky-400">
                            <img src={`${assetsUrl}/energy.png`} alt="energy" className="w-3.5 h-3.5" />
                            +{energy}
                        </span>
                    )}
                </div>
            </div>

            {/* Action */}
            {isDone ? (
                <span className="text-xs text-green-400 font-medium shrink-0">Done ✓</span>
            ) : task.userState.isClaimAvailable ? (
                <button
                    onClick={onClaim}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-400 text-zinc-900 hover:bg-amber-300 active:scale-95 transition-all"
                >
                    Claim
                </button>
            ) : (
                <button
                    onClick={onGo}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all"
                >
                    Go →
                </button>
            )}
        </li>
    );
};

export default TaskRow;

import { Task, TaskReward } from "make-traffic-integration-core";

/**
 * Returns the reward value for the given type, or 0 if not found.
 *
 * @example
 * ```ts
 * const points = getRewardValue(task.rewards, 'points');
 * ```
 */
export const getRewardValue = (
    rewards: TaskReward[],
    type: TaskReward["type"]
): number => rewards.find((r) => r.type === type)?.value ?? 0;

/**
 * Builds the icon URL for a task using `customMetadata.icon`.
 * - If `icon` is an absolute URL it is returned as-is.
 * - Otherwise `assetsPath` is prepended: `"<assetsPath>/<icon>.svg"`.
 * - Falls back to `"<assetsPath>/www.svg"` when no icon is set.
 *
 * @param task       The task object.
 * @param assetsPath Base URL/path for assets (e.g. `"https://cdn.example.com/assets"`).
 *
 * @example
 * ```ts
 * const iconUrl = getTaskIconUrl(task, window.config.assets_path);
 * ```
 */
export const getTaskIconUrl = (task: Task, assetsPath: string = ""): string => {
    const meta = task.customMetadata as { icon?: string } | null;
    const icon = meta?.icon;

    if (icon) {
        // Already a full URL — use directly
        if (icon.startsWith("http://") || icon.startsWith("https://")) return icon;
        return assetsPath ? `${assetsPath}/${icon}.svg` : `${icon}.svg`;
    }

    return assetsPath ? `${assetsPath}/www.svg` : "www.svg";
};

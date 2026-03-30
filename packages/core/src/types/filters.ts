export type EntityType = "task" | "deal" | "all";

export interface TaskFilters {
    /** Default keeps legacy behavior (active only). Use 'all' to not filter by active state. */
    isActive?: boolean | "all";           // default: true (legacy)
    entityType?: EntityType;              // default: 'all'
    pluginIds?: number[];                 // e.g., [1,2,3]
    categories?: string[];                // e.g., ['default','partners']
    page?: number;
    pageSize?: number;
    authProvider?: string;
}

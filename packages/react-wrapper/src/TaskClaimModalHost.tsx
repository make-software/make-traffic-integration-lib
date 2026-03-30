import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TaskManagerApp, Events, ClaimModalOpenPayload } from "make-traffic-integration-core";

export interface TaskClaimModalHostProps {
    taskManagerApp: TaskManagerApp;
    /** Class name applied to the backdrop overlay. */
    overlayClassName?: string;
    /** Inline styles merged into the backdrop overlay. */
    overlayStyle?: React.CSSProperties;
    /** Class name applied to the modal content panel. */
    className?: string;
    /** Inline styles merged into the modal content panel. */
    style?: React.CSSProperties;
    /** Class name applied to the inner content wrapper (padding container). */
    contentClassName?: string;
    /** Inline styles merged into the inner content wrapper. */
    contentStyle?: React.CSSProperties;
}

/**
 * Hosts plugin-rendered UI inside a modal shell.
 *
 * Subscribes to `ClaimModalOpen` on the task manager. When fired, opens a
 * bottom-sheet modal and passes a DOM container back to the plugin via
 * `provideHost`. The plugin (e.g. a quiz) renders its own content into that
 * container. When the user closes the modal, `ClaimModalClosed` is emitted
 * back to the core.
 *
 * Place it once near the root of your app:
 * ```tsx
 * <TaskClaimModalHost taskManagerApp={makeTrafficApp} />
 * ```
 */
export const TaskClaimModalHost: React.FC<TaskClaimModalHostProps> = ({
    taskManagerApp,
    overlayClassName,
    overlayStyle,
    className,
    style,
    contentClassName,
    contentStyle,
}) => {
    const [payload, setPayload] = useState<ClaimModalOpenPayload | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const provideHostCalledRef = useRef(false);

    // Keep a stable close callback that always sees the latest payload
    const closeRef = useRef<() => void>(() => {});
    closeRef.current = () => {
        if (!payload) return;
        taskManagerApp.emit(Events.ClaimModalClosed, {
            task: payload.task,
            reason: "user_closed",
        });
        setPayload(null);
    };

    useEffect(() => {
        const handler = (p: ClaimModalOpenPayload) => {
            provideHostCalledRef.current = false;
            setPayload((prev) => prev ?? p); // ignore if already open
        };
        taskManagerApp.subscribe(Events.ClaimModalOpen, handler);
        return () => taskManagerApp.unsubscribe(Events.ClaimModalOpen, handler);
    }, [taskManagerApp]);

    // Call provideHost once both container div and payload are ready
    useEffect(() => {
        if (container && payload && !provideHostCalledRef.current) {
            provideHostCalledRef.current = true;
            payload.provideHost({
                container,
                close: () => closeRef.current(),
            });
        }
    }, [container, payload]);

    if (!payload) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                onClick={() => closeRef.current()}
                className={overlayClassName}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 998,
                    ...overlayStyle,
                }}
            />

            {/* Centered dialog */}
            <div
                className={className}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 999,
                    background: "#141528",
                    borderRadius: "12px",
                    boxShadow: "inset 0 0 0 1px #41424E",
                    width: "90%",
                    maxWidth: "480px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    ...style,
                }}
            >
                {/* Plugin renders into this div */}
                <div
                    ref={setContainer}
                    className={contentClassName}
                    style={{ padding: 16, ...contentStyle }}
                />
            </div>
        </>,
        document.body
    );
};

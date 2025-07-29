import React from "react";
import { Room } from "livekit-client";
interface FloatingVideoDisplayProps {
    room?: Room | null;
    videoTrack?: any;
    /**
     * Whether to mirror the video horizontally (like a mirror reflection).
     * Useful for selfie-style video displays where users expect to see themselves
     * as they would in a mirror.
     * @default true
     */
    mirror?: boolean;
}
/**
 * FloatingVideoDisplay component for displaying local camera feed in a floating window.
 *
 * Provides a collapsible video display with optional horizontal mirroring.
 * Ideal for selfie-style applications where users expect mirror-like behavior.
 *
 * @param {FloatingVideoDisplayProps} props - Component props
 * @param {Room | null} props.room - LiveKit room instance
 * @param {any} props.videoTrack - Video track reference (optional)
 * @param {boolean} props.mirror - Enable horizontal video mirroring (default: true)
 *
 * @example
 * ```tsx
 * function App() {
 *   const convaiClient = useConvaiClient();
 *
 *   return (
 *     <FloatingVideoDisplay
 *       room={convaiClient.room}
 *       videoTrack={convaiClient.videoTrack}
 *       mirror={true}
 *     />
 *   );
 * }
 * ```
 */
export declare const FloatingVideoDisplay: React.FC<FloatingVideoDisplayProps>;
/**
 * LocalVideoDisplay component for rendering local camera feed.
 *
 * Displays the local participant's camera with optional horizontal mirroring.
 * Shows appropriate placeholder when camera is disabled or unavailable.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.mirror - Enable horizontal video mirroring (default: false)
 *
 * @example
 * ```tsx
 * function VideoComponent() {
 *   return <LocalVideoDisplay mirror={true} />;
 * }
 * ```
 */
export declare const LocalVideoDisplay: React.FC<{
    mirror?: boolean;
}>;
export {};
//# sourceMappingURL=FloatingVideoDisplay.d.ts.map
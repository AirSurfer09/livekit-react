import type { AgentState } from "@livekit/components-react";
interface NoAgentNotificationProps extends React.PropsWithChildren<object> {
    state: AgentState;
}
/**
 * Renders some user info when no agent connects to the room after a certain time.
 */
export declare function NoAgentNotification(props: NoAgentNotificationProps): import("react/jsx-runtime").JSX.Element;
export {};

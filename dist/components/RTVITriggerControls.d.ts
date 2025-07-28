import React from "react";
export interface RTVITriggerControlsProps {
    sendRTVI?: (triggerName: string, message?: string) => void;
    isConnected?: boolean;
    className?: string;
}
export declare const RTVITriggerControls: React.FC<RTVITriggerControlsProps>;

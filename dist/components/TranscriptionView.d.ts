import React from "react";
import { TranscriptionSegment } from "../types";
export interface TranscriptionViewProps {
    transcriptions?: TranscriptionSegment[];
    className?: string;
    maxHeight?: string;
    maxWidth?: string;
}
export declare const TranscriptionView: React.FC<TranscriptionViewProps>;

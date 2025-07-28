import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
export const TranscriptionView = ({ transcriptions = [], className = "", maxHeight = "200px", maxWidth = "512px" }) => {
    const containerRef = useRef(null);
    // scroll to bottom when new transcription is added
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [transcriptions]);
    return (_jsxs("div", { className: `relative mx-auto ${className}`, style: { height: maxHeight, width: maxWidth, maxWidth: '90vw' }, children: [_jsx("div", { className: "absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent z-10 pointer-events-none" }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent z-10 pointer-events-none" }), _jsx("div", { ref: containerRef, className: "h-full flex flex-col gap-2 overflow-y-auto px-4 py-8", children: transcriptions.map((segment) => (_jsx("div", { id: segment.id, className: segment.role === "assistant"
                        ? "p-2 self-start fit-content"
                        : "bg-gray-800 rounded-md p-2 self-end fit-content", children: segment.text }, segment.id))) })] }));
};

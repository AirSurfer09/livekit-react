/**
 * Hook to listen for incoming data messages from the WebRTC connection
 * Parses bytes to JSON and logs to console
 */
export declare function useDataMessageListener(): {
    isListening: boolean;
};

import { useCallback } from "react";
import { Room, RoomEvent } from "livekit-client";
import { ChatMessage } from "../types";
import { logger } from "../utils/logger";

export const useMessageHandler = (
  room: Room | null,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
) => {
  const handleDataReceived = useCallback(
    (payload: Uint8Array, participant: any) => {
      try {
        // Decode bytes to string
        const decoder = new TextDecoder();
        const messageString = decoder.decode(payload);

        // Parse JSON
        const messageData = JSON.parse(messageString);

        logger.log("📨 Data message received:", messageData);

        // Extract and categorize messages for chat display
        const timestamp = new Date().toISOString();
        const messageId = `${messageData.type}-${Date.now()}-${Math.random()}`;

        // Debug: Log all incoming messages to see what's being received
        logger.log(
          "%c📨 INCOMING MESSAGE%c",
          "background: #673ab7; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
          {
            type: messageData.type,
            data: messageData.data,
            message: messageData.message,
            text: messageData.text,
            content: messageData.content,
            fullMessage: messageData,
          },
        );

        // Handle different message types
        switch (messageData.type) {
          // User text messages - Skip these, only allow user-transcription
          case "user_text_message":
          case "user-llm-text":
          case "text-input":
          case "user-input":
          case "text-message":
          case "chat-message":
          case "input-text":
          case "message":
            // Skip user text messages - only allow user-transcription
            logger.log(
              "%c🚫 SKIPPED USER TEXT%c %c" +
                (messageData.data?.text ||
                  messageData.message ||
                  messageData.text ||
                  messageData.content ||
                  "unknown"),
              "background: #ff5722; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              "color: #ff5722; font-weight: bold;",
              "color: #f7f1e3;",
            );
            break;

          // Bot LLM Text Messages
          case "bot-llm-text":
            logger.log(
              "%c🔍 DEBUG BOT-LLM-TEXT%c",
              "background: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              {
                hasData: !!messageData.data,
                dataKeys: messageData.data ? Object.keys(messageData.data) : [],
                fullMessage: messageData,
              },
            );
            if (messageData.data?.text) {
              const convaiMessage: ChatMessage = {
                id: messageId,
                type: "bot-llm-text",
                content: messageData.data.text,
                timestamp,
              };
              setChatMessages((prev) => [...prev, convaiMessage]);
              logger.log(
                "%c🤖 CONVAI MESSAGE%c %c" + messageData.data.text,
                "background: #45b7d1; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                "color: #45b7d1; font-weight: bold;",
                "color: #f7f1e3;",
              );
            }
            break;

          // User Transcription Messages
          case "user-transcription":
            if (messageData.data?.text && messageData.data?.final) {
              const messageContent = messageData.data.text;

              // Check if this transcription already exists to prevent duplicates
              setChatMessages((prev) => {
                const alreadyExists = prev.some(
                  (msg) =>
                    msg.type === "user-llm-text" &&
                    msg.content.toLowerCase().trim() ===
                      messageContent.toLowerCase().trim(),
                );

                if (alreadyExists) {
                  logger.log(
                    "%c🔄 DUPLICATE SKIPPED%c UserTranscription: %c" +
                      messageContent,
                    "background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                    "color: #ff6b6b; font-weight: bold;",
                    "color: #ffa726; font-weight: bold;",
                  );
                  return prev;
                }

                const userMessage: ChatMessage = {
                  id: messageId,
                  type: "user-llm-text",
                  content: messageContent,
                  timestamp: messageData.data.timestamp || timestamp,
                };

                logger.log(
                  "%c🎤 USER TRANSCRIPTION%c %c" + messageContent,
                  "background: #ffa726; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                  "color: #ffa726; font-weight: bold;",
                  "color: #f7f1e3;",
                );
                return [...prev, userMessage];
              });
            }
            break;

          // Bot Emotion Messages
          case "bot-emotion":
            if (messageData.data?.emotion) {
              const emotionMessage: ChatMessage = {
                id: messageId,
                type: "bot-emotion",
                content: `${messageData.data.emotion} (scale: ${messageData.data.scale || 1})`,
                timestamp,
              };
              setChatMessages((prev) => [...prev, emotionMessage]);
              logger.log(
                "%c😊 CONVAI EMOTION%c %c" +
                  messageData.data.emotion +
                  "%c (scale: %c" +
                  (messageData.data.scale || 1) +
                  "%c)",
                "background: #e91e63; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                "color: #e91e63; font-weight: bold;",
                "color: #f7f1e3; font-weight: bold;",
                "color: #e91e63;",
                "color: #ffeb3b; font-weight: bold;",
                "color: #e91e63;",
              );
            }
            break;

          // Action Response Messages
          case "action-response":
            if (messageData.data?.actions) {
              const actionMessage: ChatMessage = {
                id: messageId,
                type: "action",
                content: `Actions: ${messageData.data.actions.join(", ")}`,
                timestamp,
              };
              setChatMessages((prev) => [...prev, actionMessage]);
              logger.log(
                "%c🎭 ACTION RESPONSE%c %c" +
                  messageData.data.actions.join(", "),
                "background: #9c27b0; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                "color: #9c27b0; font-weight: bold;",
                "color: #f7f1e3;",
              );
            }
            break;

          // Behavior Tree Response Messages
          case "behavior-tree-response":
            if (messageData.data?.narrative_section_id) {
              const behaviorMessage: ChatMessage = {
                id: messageId,
                type: "behavior-tree",
                content: `Narrative Section: ${messageData.data.narrative_section_id}`,
                timestamp,
              };
              setChatMessages((prev) => [...prev, behaviorMessage]);
              logger.log(
                "%c🌳 BEHAVIOR TREE%c %c" +
                  messageData.data.narrative_section_id,
                "background: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                "color: #4caf50; font-weight: bold;",
                "color: #f7f1e3;",
              );
              logger.log(
                "%c🌳 BT DETAILS%c",
                "background: #4caf50; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
                {
                  narrativeSection: messageData.data.narrative_section_id,
                  btCode: messageData.data.bt_code,
                  btConstants: messageData.data.bt_constants,
                },
              );
            }
            break;

          // Moderation Response Messages
          case "moderation-response":
            logger.log(
              "%c🛡️ MODERATION%c %c" + (messageData.data?.result || "unknown"),
              "background: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              "color: #ff9800; font-weight: bold;",
              "color: #f7f1e3;",
            );
            logger.log(
              "%c🛡️ MODERATION DETAILS%c",
              "background: #ff9800; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              {
                result: messageData.data?.result,
                userInput: messageData.data?.user_input,
                reason: messageData.data?.reason,
              },
            );
            break;

          // Trigger Messages
          case "trigger-message":
            logger.log(
              "%c🎯 TRIGGER MESSAGE%c",
              "background: #2196f3; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              messageData.data,
            );
            break;

          // Template Keys Updates
          case "update-template-keys":
            logger.log(
              "%c🔑 TEMPLATE KEYS%c",
              "background: #607d8b; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              messageData.data,
            );
            break;

          // Dynamic Info Updates
          case "update-dynamic-info":
            logger.log(
              "%c🔄 DYNAMIC INFO%c",
              "background: #795548; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
              messageData.data,
            );
            break;
        }

        // Log any unhandled message types
        if (
          ![
            "user_text_message",
            "user-llm-text",
            "text-input",
            "user-input",
            "text-message",
            "chat-message",
            "input-text",
            "message",
            "bot-llm-text",
            "user-transcription",
            "bot-emotion",
            "action-response",
            "behavior-tree-response",
            "moderation-response",
            "trigger-message",
            "update-template-keys",
            "update-dynamic-info",
          ].includes(messageData.type)
        ) {
          logger.log(
            "%c🔍 UNHANDLED MESSAGE TYPE%c %c" + messageData.type,
            "background: #f44336; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
            "color: #f44336; font-weight: bold;",
            "color: #f7f1e3;",
          );
          logger.log(
            "%c🔍 UNHANDLED DATA%c",
            "background: #f44336; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;",
            messageData,
          );
        }
      } catch (error) {
        logger.error("Failed to parse data message:", error);
      }
    },
    [setChatMessages],
  );

  const setupMessageListener = useCallback(() => {
    if (!room) return;

    // Listen for data received events
    room.on(RoomEvent.DataReceived, handleDataReceived);

    // Return cleanup function
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, handleDataReceived]);

  return {
    setupMessageListener,
  };
};

1. Message Reactions
   Let users react with emojis (like Slack/WhatsApp).
   Tech: Store reactions in DB, broadcast via WebSocket
2. Read Receipts & Typing Indicators
   Show "✓✓ Read" and "User is typing..." statuses.
   Tech: Track onFocus/onBlur events and keystrokes.
3. Voice Messages
   Record and send audio clips.
   Tech: Web Audio API + FFmpeg for compression.

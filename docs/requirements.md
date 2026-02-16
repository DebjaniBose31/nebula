# Architecture

## Functional Requirements

- Session Management
- Audio Streaming
- Realtime Terminal
- Port Forwarding
- Cursor Tracking
- File Tree Synchronization

User Load Limit: 1,000/day  
The system is read heavy (Because most of the time developers will read the code rather than writing)  
Max conference limit: 10 users in each room

### Session Management

- Unique Workspace URLs: Generate cryptographically secure, non-guessable URLs (e.g., UUIDs) for every project session.
- Ephemeral vs. Persistent State: The system must distinguish between "active" sessions (stored in-memory/Redis for speed) and "idle" sessions (persisted to a database like MongoDB or PostgreSQL).
- Participant Registry: Track a live list of "Who is online." This includes join/leave events and heartbeat mechanisms to detect "zombie" users who disconnected without closing the tab.
- Role-Based Access (RBAC): Even in an anonymous IDE, you may need "Host" vs. "Guest" permissions to prevent a guest from deleting the entire file tree.

### Audio Streaming

- Signaling Exchange: Use WebSockets to exchange "Offers" and "Answers" (SDP) and ICE candidates between peers to establish a connection.
- SFU (Selective Forwarding Unit) Integration: For more than 3 users, P2P (Peer-to-Peer) audio becomes unstable. The system should route audio through an SFU to manage bandwidth efficiently.
- Mute/Unmute Sync: The UI must reflect the "Mute" state of all participants globally.

### Real Time Terminal

- PTY (Pseudo-Terminal) Multiplexing: The server must run a PTY process (e.g., node-pty). Every keystroke in the browser terminal is sent to this process, and the output is broadcast to all users via WebSockets.
- Input Conflict Handling: If two users type in the terminal simultaneously, the characters must appear in the order the server receives them.
- Terminal Re-sync: If a user joins late, they must receive the last ~500 lines of terminal output (buffer) so they aren't looking at a blank screen.

### Port Forwarding

- Proxy Tunneling: The backend must dynamically create a proxy (e.g., https://port-3000-session-abc.youride.com) that routes traffic into the specific container where the code is running.

### Cursor Tracking

- Coordinate Mapping: Every user’s cursor position (Line #, Column #) must be broadcast to all other users.
- Selection Highlighting: When a user selects a block of code, that range should be highlighted in a unique color assigned to that user.

### File Tree Synchronization

- Event-Driven Updates: File creation, deletion, renaming, and moving must be treated as discrete events.
- Binary vs. Text Handling: The file tree must identify which files are editable (text) and which should be downloaded/ignored (images, binaries).

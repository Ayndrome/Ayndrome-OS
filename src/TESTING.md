
# File Sharing Protocol Testing Guide

## Prerequisites
1. Node.js installed (v14+ recommended)
2. Install dependencies: npm install

## Testing Scenarios

### 1. Local Server and Client Testing
1. Start the server:
   ```
   node test-server.js
   ```

2. In a separate terminal, run the client:
   ```
   node test-client.js
   ```

### 2. Multiple File Upload Test
- Modify test-client.js to upload multiple files
- Add large files to test chunk handling

### 3. Browser-based Testing
- Create an HTML file with file input and WebSocket connection
- Use the FileShareClient in a browser environment

### Troubleshooting
- Ensure no other process is using port 8080
- Check network firewall settings
- Verify WebSocket connection

## Test Verification Points
- File transfer initiation
- Chunk-based upload
- File integrity 
- Server acknowledgment
- Error handling

### Recommended Test Files
- Small text files (< 1MB)
- Large text files (10MB+)
- Various file types (txt, pdf, images)
);
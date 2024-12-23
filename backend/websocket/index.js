const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

class WebSocketManager {
  constructor() {
    this.io = null;
    this.connections = new Map();
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
      }
    });

    this.io.use(this.authMiddleware);
    this.io.on('connection', this.handleConnection.bind(this));
  }

  authMiddleware(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userID = decoded.userID;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  }

  handleConnection(socket) {
    this.connections.set(socket.userID, socket);

    socket.on('disconnect', () => {
      this.connections.delete(socket.userID);
    });
  }

  notifyUser(userID, event, data) {
    const socket = this.connections.get(userID);
    if (socket) {
      socket.emit(event, data);
    }
  }

  notifyAll(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = new WebSocketManager();

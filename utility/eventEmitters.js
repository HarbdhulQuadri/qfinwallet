class CustomEventEmitters {
    constructor(io, socket) {
        this.emitToSelf = (event, data, callback) => {
            // basic emit
            socket.emit(event, data, callback);
        };

        this.emitToOthersExceptSelf = (event, data, callback) => {
            // to all clients in the current namespace except the sender
            socket.broadcast.emit(event, data, callback);
        };

        this.emitToOthersExceptSelfInRoom = (event, data, room, callback) => {
            // to all clients in room1 except the sender
            socket.to(room).emit(event, data, callback);
        };

        this.emitToOthersExceptSelfInRooms = (event, data, rooms, callback) => {
            // to all clients in room1 and/or room2 except the sender
            socket.to([...rooms]).emit(event, data, callback);
        };

        this.emitToAllInRoom = (event, data, room, callback) => {
            // to all clients in room1
            io.in(room).emit(event, data, callback);
        };

        this.emitToAllInRoomsExceptRoom = (event, data, rooms, room, callback) => {
            // to all clients in room1 and/or room2 except those in room3
            io.to([...rooms]).except(room).emit(event, data, callback);
        };

        this.emitToAllOfNamespace = (event, data,namespace, callback) => {
            // to all clients in namespace "myNamespace"
            io.of(namespace).emit(event, data, callback);
        };

        this.emitToAllOfNamespaceInRoom = (event, data, namespace, room, callback) => {
            // to all clients in room1 in namespace "myNamespace"
            io.of(namespace).to(room).emit(event, data, callback);
        };

        this.emitToIndividual = (event, data, socketId, callback) => {
            // to individual socketId (private message)
            io.to(socketId).emit(event, data, callback);
        };

        this.emitToNode = (event, data, callback) => {
            // to all clients on this node (when using multiple nodes)
            io.local.emit(event, data, callback);
        };

        this.emitToAllConnected = (event, data, callback) => {
            // to all connected clients
            io.emit(event, data, callback);
        };

        this.emitWithoutCompression = (event, data, callback) => {
            // without compression
            socket.compress(false).emit(event, data, callback);
        };

        this.emitVolatile = (event, data, callback) => {
            // a message that might be dropped if the low-level transport is not writable
            socket.volatile.emit(event, data, callback);
        };

        this.emitWithTimeOut = (event, data, timeout, callback) => {
            // with timeout
            socket.timeout(timeout).emit(event, data, callback);
        };
    }
}

module.exports = CustomEventEmitters
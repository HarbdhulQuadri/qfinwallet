class CustomEventListeners {
    constructor(socket) {
        this.listenTo = (event,callback) => {
            // basic listen
            socket.on(event,callback);
        };
    }
}

module.exports = CustomEventListeners
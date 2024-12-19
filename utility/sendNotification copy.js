let notificationThirdParty = require("../thirdParty/notifications");
let notificationModel = require("../v2/user/model/notification");

const AndroidData = async (title, body, notification_type, ID) => {
    let data = {};
    try {
        data.data = {
            title: title,
            message: body,
            notification_type: notification_type,
            ID: ID
        }
        return (data)
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

function iOSData(title, body, notification_type) {
    return new Promise(resolve => {
        let data = {
            notification: {
                title: title,
                body: body,
                icons: "ic_launcher",
                sound: "default",
                content_type: 'text',
                notification_type: notification_type
            }
        };
        resolve(data)
    })
}

const likesOnYourPost = async (data) => {
    try {
        const result = await notificationModel.getFeedPoster(data);
        let deviceOS = result.data[0].deviceOS
        let userID = result.data[0].userID
        if (data.userID !== userID) {
            if (deviceOS === "Android") {
                const androidData = await AndroidData("Like Post", "You got a new like on your post. See  likes", "likePost", data.feedID);
                notificationThirdParty.sendNotification(result.data[0].deviceToken, androidData);
            }
        }
    } catch (error) {
        return ({ error: true, message: error.message })
    }
}

const commentsOnYourPost = async (data) => {
    try {
        const result = await notificationModel.getFeedPoster(data);
        let deviceOS = result.data[0].deviceOS
        if (deviceOS === "Android") {
            const androidData = await AndroidData("Comment Post", "You have a new comment on your post. View comment ", "commentPost", data.feedID);
            notificationThirdParty.sendNotification(result.data[0].deviceToken, androidData);
        }
    } catch (error) {
        return ({ error: true, message: error.message })
    }
};


const sendsYouMessage = async ({ userID }) => {
    try {
        const { data: [{ deviceOS, deviceToken, userID: receiverID }] } = await notificationModel.getMessageReceiver({ userID });
        if (deviceOS === "Android") {
            const androidData = await AndroidData("New Message", "You have a new unread message(s). View message(s)", "sendMessage", receiverID);
            notificationThirdParty.sendNotification(deviceToken, androidData);
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    likesOnYourPost,
    commentsOnYourPost,
    sendsYouMessage,
}
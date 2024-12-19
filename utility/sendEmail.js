let notificationThirdParty = require("../thirdParty/email");


const sendResetPassword = async (data) => {
    try {
        data.to = data.email;
        data.templateId = "d-f11d8fa403254bdb8cc73b3d4028e28c"
        data.object = {
            "name" : data.fullName,
            "code" : data.newPassword,
            "message" : "Please use the  below to as your new password and change the password at the profile."
        }
        console.log(data);
        notificationThirdParty.sendEmail(data);
    } catch (error) {
        return ({error: true, message: error.message})
    }
}

module.exports = {
    sendResetPassword,
}
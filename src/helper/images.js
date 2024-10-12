const fs = require('fs')

exports.deleteImages = (images) => {
    try {
        for (let imgPath of images) {
            imgPath ? fs.unlinkSync(imgPath) : false;
        }
    } catch (error) {
        console.log(error)
    }
}
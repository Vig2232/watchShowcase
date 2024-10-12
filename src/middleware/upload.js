const multer = require('multer');
const path = require('path')


exports.imageUpload = () => {
    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public')
        },
        filename: (req, file, cb) => {
            let filetypes = /jpeg|jpg|png/;
            let mimetype = filetypes.test(file.mimetype);
            let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            if (mimetype && extname) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }
    });
    return multer({ storage: storage })
}
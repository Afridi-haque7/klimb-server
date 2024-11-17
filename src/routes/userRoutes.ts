import express,{Router} from 'express';
import multer from 'multer';

const user = express();
const userController = require('../controllers/userController');    // Importing the controller
const upload = multer({dest: "uploads/"}); // Using multer to upload file in the destination folder
user.post('/uploadFile', upload.single("file"), userController.importFile) // API route to upload the file

export default user;
import express from 'express';
import mongoose from "mongoose";
import multer from 'multer';
import cors from 'cors';
import path from 'path';

import { userController } from './controllers/index.js';
import { registerValidation, loginValidation } from './validations/auth.js';
import { checkAuth, handleValidationErrors, getFileExtension } from './utils/index.js';

// 'mongodb+srv://analityx:qwerty1981@cluster0.1yvelnj.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Connect to DB'))
  .catch((error) => console.log('Error connect', error));

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + getFileExtension(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    console.log(req);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

app.use(express.json());
app.use(cors());
app.use('/upload', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', upload.single('avatar'), registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', checkAuth, userController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (request, response) => {
  response.json({
    url: `/uploads/${request.file.originalname}`,
  });
});

app.listen(process.env.PORT || 8080, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log('Server is working');
});

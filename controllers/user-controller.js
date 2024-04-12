import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.js';

export const register = async (request, response) => {
  try {
    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: request.body.email,
      name: request.body.name,
      avatar: request.file?.path ? request.file.path : '',
      contact: request.body.contact ? request.body.contact : '',
      address: request.body.address ? request.body.address : '',
      role: request.body.role,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Failed to register",
    });
  }
};

export const login = async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });

    if (!user) {
      return response.status(404).json({
        message: 'User is not found',
      });
    }

    const isValidPassword = await bcrypt.compare(request.body.password, user._doc.passwordHash);

    if (!isValidPassword) {
      return response.status(400).json({
        message: 'Wrong login or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    response.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Failed to login",
    });
  }
};

export const getMe = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      return response.status(404).json({
        message: 'User is not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    response.json(userData);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "No access",
    });
  }
}

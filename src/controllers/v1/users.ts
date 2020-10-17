import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Users from '../../mongo/models/users';
import Products from '../../mongo/models/products';

const expiresIn = 60 * 60;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }); // buscar usuario y filtrar por email
    if (user) {
      if (password === user.password) {
        //crear un token para consumir los servicios apartir de datos del user y con un secret
        // y agregar un tiempo de expiracion
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET!,
          { expiresIn }
        );

        res.send({ status: 'OK', data: { token, expiresIn } });
      } else {
        res
          .status(403)
          .send({ status: 'INVALID_PASSWORD', message: 'Invalid password' });
      }
    } else {
      res
        .status(404)
        .send({ status: 'USER_NOT_FOUND', message: 'User not Found' });
    }
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, data } = req.body;
  try {
    await Users.create({
      username,
      email,
      password,
      data,
    });

    res.send({ status: 'OK', message: `Created ${req.body.username}` });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res.status(401).send({ status: 'DUPLICATE', message: error.keyValue });
      return;
    }
    res.status(401).send({ status: 'Failed', message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error('Missing param userId');
    }

    await Users.findByIdAndDelete(userId);
    await Products.deleteMany({ user: userId });
    res.send({ status: 'OK', message: 'Deleted' });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.find().select({
      password: 0, // devuelve el resto de campos diferentes a password
      role: 0, // siempre deben ser 0 o 1, no hacer mezclas
      __v: 0,
    });
    res.send({ status: 'OK', data: users });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('req.sessionData', req.sessionData.userId);
    const { userId } = req.sessionData;

    const { email, data } = req.body;
    await Users.findByIdAndUpdate(
      userId,
      {
        data,
      }

      // { useFindAndModify: false }
    );
    res.send({ status: 'OK', message: 'Updated' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res.status(400).send({ status: 'DUPLICATE', message: error.keyValue });
      return;
    }
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

export default { createUser, deleteUser, getUsers, updateUser, login };

import { Application } from 'express';
import productsRoutes from './products';
import usersRoutes from './users';

export default (app: Application) => {
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/products', productsRoutes);
};

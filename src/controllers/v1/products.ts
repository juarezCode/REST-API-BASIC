import { Request, Response } from 'express';
import Products from '../../mongo/models/products';

const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, desc, price, images, userId } = req.body;

    const product = await Products.create({
      title,
      desc,
      price,
      images,
      user: userId,
    });
    res.send({ status: 'OK', data: product });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', data: error.message });
  }
};

const deleteProduct = (req: Request, res: Response) => {
  console.log('delete');
};

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Products.find({
      price: { $gt: 20 }, // filtro mayor a 20 en campo precio
    }) // metodo que devuelve usuarios filtrados

      .select('title desc price') // campos de producto que se devolveran
      .populate('user', 'username email'); // devuelve user y las propiedades que se agreguen
    res.send({ status: 'OK', data: products });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', data: error });
  }
};

const getProductsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Products.find({
      user: req.params.userId,
    });
    res.send({ status: 'OK', data: products });
  } catch (error) {
    res.status(500).send({ status: 'ERROR', data: error });
  }
};

export default {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByUser,
};

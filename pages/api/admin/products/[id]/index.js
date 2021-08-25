import nc from 'next-connect';
import { isAuth } from '../../../../../utils/auth';
import { isAdmin } from '../../../../../utils/auth';
import db from '../../../../../utils/db';
import Product from '../../../../../models/Products';

const handler = nc({});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  db.connect();
  const product = await Product.findById(req.query.id);
  db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.image = req.body.image;
    product.featuredImage = req.body.featuredImage;
    product.isFeatured = req.body.isFeatured;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
});

handler.delete(async (req, res) => {
  db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await db.disconnect();
    res.send({ meaasge: 'Product deleted' });
  } else {
      await db.disconnect()
      res.status(404).send({message: 'product not found'})
  }
});

export default handler;

import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Products';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async(req,res) => {
  await db.connect()
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-slug' + Math.random(),
    image: '/images/sample.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    description: 'sample description'
  })
  const product = await newProduct.save()
  await db.disconnect()
  res.status(201).send({message: 'Product created successfully', product})
})

export default handler;

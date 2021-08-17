import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import Product from '../models/Products';
import data from '../utils/data';
import db from '../utils/db';

export default function Home(props) {
  const { products } = props;
  return (
    <Layout>
      <div>
        <h2>Products</h2>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/product/${product.slug}`}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={product.image}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>

                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size="small" color="primary">
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  db.connect();
  const products = await Product.find({}).lean();
  db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj)
    },
  };
}

import { useRouter } from 'next/router';
import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Link, Grid, ListItem, List, Typography } from '@material-ui/core';
import Layout from '../../components/Layout';
import data from '../../utils/data';
import useStyles from '../../utils/styles';

const ProductPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;
  const product = data.products.find((a) => a.slug === slug);
  if (!product) {
    return <div>Product not Found</div>;
  }
  return (
    <Layout title={product.name}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Go Back</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Ratings: {product.rating} stars ({product.numReviews}) reviews
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ProductPage;

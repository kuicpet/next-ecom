import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Link,
  Grid,
  ListItem,
  List,
  Typography,
  Card,
  Button,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import Layout from '../../components/Layout';
//import data from '../../utils/data';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Product from '../../models/Products';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { Rating } from '@material-ui/lab';

const ProductPage = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { product } = props;
  const classes = useStyles();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setLoading(false);
      enqueueSnackbar('Review submitted succesfully', { variant: 'success' });
      fetchReviews();
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: 'error' });
    }
  };
  useEffect(() => {
    fetchReviews();
  });
  if (!product) {
    return <div>Product not Found</div>;
  }

  const addToCartHandler = async (product) => {
    closeSnackbar();
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const qty = existItem ? existItem.qty + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < qty) {
      enqueueSnackbar('Sorry, Product out of Stock', { variant: 'error' });
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, qty } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} description={product.description}>
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
              <Typography component="h1">{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly />
            </ListItem>
            <ListItem>
              <Typography>Reviews: ({product.numReviews}) reviews</Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => addToCartHandler(product)}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography variant="h2">Customer Reviews</Typography>
        </ListItem>
        {reviews.length === 0 && (
          <ListItem>
            <Typography>No review</Typography>
          </ListItem>
        )}
        {reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong>{review.name}</strong>
                </Typography>
                <Typography>{review.createdAt}</Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant="h1">Leave your Review</Typography>
                </ListItem>
                {/*<ListItem>
                  <Controller
                    name="comment"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: true,
                      minLength: 5,
                    }}
                    render={({ field }) => (
                      <TextField
                        id="comment"
                        fullWidth
                        variant="outlined"
                        label="Enter comment"
                        error={Boolean(errors.comment)}
                        helperText={
                          errors.comment
                            ? errors.comment.type === 'minLength'
                              ? 'Comment is too short'
                              : 'Comment is required'
                            : ''
                        }
                        {...field}
                      ></TextField>
                    )}
                  ></Controller>
                      </ListItem>*/}
                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Enter comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Submit Review
                  </Button>
                  {loading && <CircularProgress />}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography>
              Please{' '}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                Login
              </Link>{' '}
              to write a review
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  db.connect();
  const product = await Product.findOne({ slug }, '-reviews').lean();

  db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}

export default ProductPage;

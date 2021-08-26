import {
  Box,
  Grid,
  List,
  ListItem,
  MenuItem,
  Typography,
  Select,
  Button,
} from '@material-ui/core';
import { Pagination, Rating } from '@material-ui/lab';
import React, { useContext } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Products';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const PAGE_SIZE = 3;
const prices = [
  {
    name: '$1 - $50',
    value: '1 - 50',
  },
  {
    name: '$51 - $200',
    value: '51 - 200',
  },
  {
    name: '$201 - $1000',
    value: '201 - 1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

const Search = (props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const addToCartHandler = async (product) => {
    closeSnackbar();
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const qty = existItem ? existItem.qty + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < qty) {
      enqueueSnackbar('Sorry, Product is Out of Stock', { variant: 'error' });
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, qty } });
    router.push('/cart');
  };
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    price = 'all',
    rating = 'all',
    sort = 'featured',
  } = router.query;
  const { products, countProducts, categories, brands, pages } = props;
  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    price,
    rating,
    searchQuery,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    if (min) query.page = page;

    router.push({
      pathname: path,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };
  const classes = useStyles();

  return (
    <Layout title="Search">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select value={category} onChange={categoryHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Brands</Typography>
                <Select value={brand} onChange={brandHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select value={rating} onChange={ratingHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem key={rating} value={rating} display="flex">
                      <Rating value={rating} readOnly />
                      <Typography component="span">&amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products.length === 0 ? 'No' : countProducts} Results
              {query !== 'all' && query !== '' && ':' + query}
              {category !== 'all' && ':' + category}
              {brand !== 'all' && ':' + brand}
              {price !== 'all' && ': Price' + price}
              {rating !== 'all' && ': Rating' + rating + '& up'}
              {(query !== 'all' && query !== '') ||
              category !== 'all' ||
              brand !== 'all' ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography className={classes.sort} component='span'>Sort by</Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem>Featured</MenuItem>
                <MenuItem>Price: Low to High</MenuItem>
                <MenuItem>Price: High to low</MenuItem>
                <MenuItem>Customer Reviews</MenuItem>
                <MenuItem>Newest Arrivals</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.mt1}>
            {products.map((product) => (
              <Grid item md={4} key={product.name}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              </Grid>
            ))}
          </Grid>
          <Pagination
            className={classes.mt1}
            defaultPage={parseInt(query.page || 1)}
            count={pages}
            onChange={pageHandler}
          ></Pagination>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || '';
  const brand = query.brand || '';
  const price = query.price || '';
  const rating = query.rating || '';
  const sort = query.sort || '';
  const searchQuery = query.query || '';

  const queryFilter =
    searchQuery && searchQuery !== 'all'
      ? {
          name: {
            $regex: searchQuery,
            $options: 'i',
          },
        }
      : {};

  const categoryFilter = category && category !== 'all' ? { category } : {};
  const brandFilter = brand && brand !== 'all' ? { brand } : {};
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order =
    sort === 'featured'
      ? { featured: -1 }
      : sort === 'lowest'
      ? { price: 1 }
      : sort === 'lowest'
      ? { price: -1 }
      : sort === 'toprated'
      ? { rating: -1 }
      : sort === 'newest'
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct('category');
  const brands = await Product.find().distinct('brand');
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
      ...ratingFilter,
      ...priceFilter,
    },
    '-reviews'
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();
  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...brandFilter,
    ...ratingFilter,
    ...priceFilter,
  });
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}

export default Search;

import Image from 'next/image';
import {
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableCell,
  TableBody,
  Link,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  Card,
} from '@material-ui/core';
import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import axios from 'axios';
import { useRouter } from 'next/router';

const CartPage = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const classes = useStyles();

  const updateCarthandler = async (item, qty) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < qty) {
      window.alert('Sorry, Product out of Stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, qty } });
  };

  const removeItemHandler = (item) => [
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item }),
  ];

  const checkOutHandler = () => {
    router.push('/shipping')
  };

  return (
    <Layout title="Shopping cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>
          You currently have no Items in your cart .
          <NextLink href="/" passHref>
            <Link>Go shopping</Link>
          </NextLink>
        </Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={40}
                              height={40}
                            />
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.qty}
                          align="right"
                          onChange={(e) =>
                            updateCarthandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">${item.price}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    SubTotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)
                    : $ {''}{' '}
                    {cartItems.reduce((a, c) => a + c.qty * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.button}
                    onClick={checkOutHandler}
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CartPage), { ssr: false });

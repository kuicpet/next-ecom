import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { Store } from '../../utils/Store';
import useStyles from '../../utils/styles';
import { DescriptionOutlined, GroupAddOutlined, InboxOutlined, PersonOutlineRounded } from '@material-ui/icons';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: '',
      };

    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      state;
      break;
  }
}

const AdminOrders = () => {
  const router = useRouter();
  const classes = useStyles();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/orders', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        // console.log(data);
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(error) });
      }
    };
    fetchOrders();
  }, [router, userInfo]);
  return (
    <Layout title="Orders">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem  button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                  <ListItemIcon>
                    <PersonOutlineRounded />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                  <ListItemIcon>
                    <DescriptionOutlined />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                  <ListItemIcon>
                    <InboxOutlined />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                  <ListItemIcon>
                    <GroupAddOutlined />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell>PAID</TableCell>
                          <TableCell>DELIVERED</TableCell>
                          <TableCell>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{(order._id).slice(0, 5)}...{(order._id).slice(order._id.length -4)}</TableCell>
                            <TableCell>{order.user? order.user.name : 'Deleted user'}</TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>${order.totalPrice}</TableCell>
                            <TableCell>
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : 'not paid'}
                            </TableCell>
                            <TableCell>
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : 'not delivered'}
                            </TableCell>
                            <TableCell>
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        )).reverse()}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });

import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
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
        users: action.payload,
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

const AdminUsers = () => {
  const router = useRouter();
  const classes = useStyles();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    users: [],
  });
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchUsers = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/users', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        console.log(data);
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(error) });
      }
    };
    fetchUsers();
  }, []);
  return (
    <Layout title="Users">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Users
                    </Typography>
                  </Grid>
                  <Grid item align="right" xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                    >
                      Create
                    </Button>
                  </Grid>
                </Grid>
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
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>ISADMIN</TableCell>
                          <TableCell>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'yes' : 'no'}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/user/${user._id}`}
                                passHref
                              >
                                <Button variant="contained" size="small">
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <Button variant="contained" size="small">
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
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

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });

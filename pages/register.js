import {
  Button,
  List,
  ListItem,
  TextField,
  Typography,
  Link,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';

const Register = () => {
  const router = useRouter();
  const redirect = router.query;
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
 useEffect(() => {
  if (userInfo) {
    router.push('/');
  }
 },[])
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      console.log(data);
      Cookies.set('userInfo', data);
      router.push(redirect || '/');
    } catch (error) {
      alert(error.response.data ? error.response.data.message : error.message);
    }
  };
  return (
    <Layout title="Register">
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <TextField
              id="name"
              fullWidth
              variant="outlined"
              label="Name"
              inputProps={{ type: 'text' }}
              onChange={(e) => setName(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              id="email"
              fullWidth
              variant="outlined"
              label="Email"
              inputProps={{ type: 'email' }}
              onChange={(e) => setEmail(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              id="password"
              variant="outlined"
              label="Password"
              inputProps={{ type: 'password' }}
              onChange={(e) => setPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              inputProps={{ type: 'password' }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></TextField>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              className={classes.button}
            >
              Register
            </Button>
          </ListItem>
          <ListItem>
            Have an Account? &nbsp;
            <NextLink href={`/login?redirect=${redirect} || '/`} passHref>
              <Link> Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;

import {
    Button,
    List,
    ListItem,
    TextField,
    Typography,
    Link,
  } from '@material-ui/core';
import React from 'react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';

const Register = () => {
    const classes = useStyles()
  return (
    <Layout title="Login">
      <form className={classes.form}>
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
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              id="email"
              fullWidth
              variant="outlined"
              label="Email"
              inputProps={{ type: 'email' }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              id="password"
              variant="outlined"
              label="Password"
              inputProps={{ type: 'password' }}
            ></TextField>
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              id="confirmPassword"
              variant="outlined"
              label="Confirm Password"
              inputProps={{ type: 'password' }}
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
            <NextLink href="/login" passHref>
              <Link> {' '} Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};

export default Register;

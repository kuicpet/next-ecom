import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import NextLink from 'next/link';
import useStyles from '../utils/styles';

const Layout = ({ title, description, children }) => {
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next-Ecom`: 'Next-Ecom'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <NextLink href="/">
            <Link>
              <Typography className={classes.brand}>Next-Ecom</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <NextLink href="/cart" passHref>
              <Link>Cart</Link>
            </NextLink>
            <NextLink href="/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>All rights reserved Next-Ecom</footer>
    </div>
  );
};

export default Layout;

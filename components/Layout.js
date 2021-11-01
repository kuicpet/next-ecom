import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
  InputBase,
  IconButton,
} from '@material-ui/core'
// import SearchIcon from '@material-ui/icons/Search'
import { SearchOutlined } from '@material-ui/icons'
import Head from 'next/head'
import React, { useContext, useState } from 'react'
import NextLink from 'next/link'
import useStyles from '../utils/styles'
import { Store } from '../utils/Store'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const Layout = ({ title, description, children }) => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { darkMode, cart, userInfo } = state
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      body1: {
        fontWeight: 'normal',
      },
    },
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f47036',
      },
      secondary: {
        main: '#2e2e2e',
      },
    },
  })
  const classes = useStyles()
  const darkModeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    const newDarkMode = !darkMode
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
  }
  const [anchorEl, setAnchorEl] = useState(null)
  const [query, setQuery] = useState('')

  const queryChangeHandler = (e) => {
    setQuery(e.target.value)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    router.push(`/search?query=${query}`)
  }
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null)
    if (redirect) {
      router.push(redirect)
    }
  }

  const logoutClickHandler = () => {
    setAnchorEl(null)
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    router.push('/')
  }

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next-Ecom` : 'Next-Ecom'}</title>
        {description && <meta name='description' content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position='static' className={classes.navbar}>
          <Toolbar>
            <NextLink href='/'>
              <Link>
                <Typography className={classes.brand}>Next-Ecom</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div className={classes.searchSection}>
              <form className={classes.searchForm} onSubmit={submitHandler}>
                <InputBase
                  name='query'
                  className={classes.searchInput}
                  placeholder='Search Products'
                  onChange={queryChangeHandler}
                />
                <IconButton
                  type='submit'
                  className={classes.IconButton}
                  aria-label='search'
                >
                  <SearchOutlined />
                </IconButton>
              </form>
            </div>
            <div>
              <Switch checked={darkMode} onChange={darkModeHandler}></Switch>
              <NextLink href='/cart' passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color='secondary'
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={loginClickHandler}
                    className={classes.navbarBtn}
                  >
                    {userInfo.name.charAt(0)}
                  </Button>
                  <Menu
                    id='simple-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                    className={classes.top}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    {!userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/order-history')
                        }
                      >
                        Order History
                      </MenuItem>
                    )}
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, '/admin/dashboard')
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href='/login' passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          All rights reserved Next-Ecom
        </footer>
      </ThemeProvider>
    </div>
  )
}

export default Layout

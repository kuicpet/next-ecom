import Image from 'next/image'
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
  IconButton,
} from '@material-ui/core'
import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import useStyles from '../utils/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import { DeleteOutlined, ArrowBackIosOutlined } from '@material-ui/icons'

const CartPage = () => {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state
  const classes = useStyles()

  const updateCarthandler = async (item, qty) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < qty) {
      window.alert('Sorry, Product out of Stock')
      return
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, qty } })
  }

  const removeItemHandler = (item) => [
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item }),
  ]

  const checkOutHandler = () => {
    router.push('/shipping')
  }

  const continueShopping = () => {
    router.push('/')
  }
  return (
    <Layout title='Shopping cart'>
      <Typography component='h1' variant='h1' align='center'>
        Shopping Cart ({cartItems.reduce((a, c) => a + c.qty, 0)})
      </Typography>
      {cartItems.length === 0 ? (
        <Typography align='center'>
          You have no Items in your cart{' '}
          <NextLink href='/' passHref>
            <Link>keep shopping</Link>
          </NextLink>
        </Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <div className={classes.section}>
              <NextLink href='/' passHref>
                <Link>
                  <ArrowBackIosOutlined />
                </Link>
              </NextLink>
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>PRODUCT</TableCell>
                    <TableCell align='justify'>QUANTITY</TableCell>
                    <TableCell align='justify'>PRICE</TableCell>
                    <TableCell align='justify'></TableCell>
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
                      <TableCell align='justify'>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align='justify'>
                        <Select
                          value={item.qty}
                          align='justify'
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
                      <TableCell align='justify'>${item.price}</TableCell>
                      <TableCell align='justify'>
                        <IconButton onClick={() => removeItemHandler(item)}>
                          <DeleteOutlined />
                        </IconButton>
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
                  <Typography variant='h2'>
                    SubTotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)
                    :
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant='h2'>
                    ${' '}
                    {cartItems
                      .reduce((a, c) => a + c.qty * c.price, 0)
                      .toFixed(2)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    className={classes.button}
                    onClick={checkOutHandler}
                  >
                    PROCEED TO CHECKOUT
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    className={classes.button}
                    onClick={continueShopping}
                  >
                    Continue Shopping
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartPage), { ssr: false })

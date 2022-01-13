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
  Button,
  List,
  ListItem,
  Card,
  CircularProgress,
  IconButton,
} from '@material-ui/core'
import React, { useContext, useEffect, useReducer } from 'react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'
import useStyles from '../../utils/styles'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { getError } from '../../utils/error'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Skeleton  from 'react-loading-skeleton'
import { DescriptionOutlined, LocalShippingOutlined, LocationOnOutlined, PaymentOutlined } from '@material-ui/icons'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: '',
      }
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'PAY_REQUEST':
      return {
        ...state,
        loadingPay: true,
      }
    case 'PAY_SUCCESS':
      return {
        ...state,
        loadingPay: false,
        successPay: true,
      }
    case 'PAY_FAIL':
      return {
        ...state,
        loadingPay: false,
        errorPay: action.payload,
      }
    case 'PAY_RESET':
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        errorPay: '',
      }
    case 'DELIVER_REQUEST':
      return {
        ...state,
        loadingDeliver: true,
      }
    case 'DELIVER_SUCCESS':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: true,
      }
    case 'DELIVER_FAIL':
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: action.payload,
      }
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: '',
      }

    default:
      return state
  }
}

const Order = ({ params }) => {
  const orderId = params.id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [
    { loading, error, order, successPay, successDeliver, loadingDeliver },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    order: {},
  })
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = order
  useEffect(() => {
    if (!userInfo) {
      return router.push('/login')
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(error) })
      }
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder()
      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [
    orderId,
    successPay,
    successDeliver,
    order._id,
    userInfo,
    router,
    paypalDispatch,
  ])
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID
      })
  }
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: 'PAY_REQUEST' })
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        )
        dispatch({ type: 'PAY_SUCCESS', payload: data })
        enqueueSnackbar('Order is paid', { variant: 'success' })
      } catch (error) {
        dispatch({ type: 'PAY_FAIL', payload: getError(error) })
        enqueueSnackbar(getError(error), { variant: 'error' })
      }
    })
  }
  const onError = (error) => {
    enqueueSnackbar(getError(error), { variant: 'error' })
  }
  const deliverOrderHandler = async () => {
    try {
      dispatch({ type: 'DELIVER_REQUEST' })
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      dispatch({ type: 'DELIVER_SUCCESS', payload: data })
      enqueueSnackbar('Order is delivered', { variant: 'success' })
    } catch (error) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(error) })
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }
  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component='h1' variant='h1'>
        Your Order id: {orderId}
      </Typography>
      {loading ? (
        <Skeleton />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem alignItems='center'>
                  <Typography component='h2' variant='h2'>
                    SHIPPING ADDRESS
                    <IconButton>
                      <LocationOnOutlined style={{color: 'green'}} />
                    </IconButton>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.capitalize}>
                    {shippingAddress.fullName},{shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country}
                    &nbsp;
                    {shippingAddress.location && (
                      <Link
                        variant='button'
                        target='_new'
                        href={`https://maps.google.com?q=${shippingAddress.location.lat},${shippingAddress.location.lng}`}
                      >
                        Show On Map
                      </Link>
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.capitalize}>
                    Status:{' '}
                    {isDelivered
                      ? `delivered at ${deliveredAt}`
                      : 'not delivered'}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    PAYMENT METHOD
                    <IconButton>
                      <PaymentOutlined  style={{color: 'orangered'}}/>
                    </IconButton>
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.capitalize}>
                    {paymentMethod}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className={classes.capitalize}>
                    Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                  </Typography>
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    ORDER ITEMS
                    <IconButton>
                      <DescriptionOutlined style={{color: 'royalblue'}} />
                    </IconButton>
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>PRODUCT</TableCell>
                          <TableCell align='justify'>QUANTITY</TableCell>
                          <TableCell align='justify'>PRICE</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>
                              <NextLink href={`/product/${item._id}`} passHref>
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
                              <NextLink href={`/product/${item._id}`} passHref>
                                <Link>
                                  <Typography>{item.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align='justify'>
                              <Typography>{item.qty}</Typography>
                            </TableCell>
                            <TableCell align='justify'>
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant='h2'>ORDER SUMMARY</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Product:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>TOTAL:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>
                        <strong>${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && !order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress />}{' '}
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.button}
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order <LocalShippingOutlined />
                    </Button>
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      params,
    },
  }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })

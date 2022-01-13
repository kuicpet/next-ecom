import {
  Button,
  List,
  Link,
  ListItem,
  TextField,
  Typography,
  IconButton,
} from '@material-ui/core'
import React, { useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'
import { useRouter } from 'next/router'
import { Store } from '../utils/Store'
import { Controller, useForm } from 'react-hook-form'
import CheckOutSteps from '../components/CheckOutSteps'
import { ArrowBackIosOutlined } from '@material-ui/icons'

const Shipping = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm()

  const router = useRouter()
  const classes = useStyles()
  const { state, dispatch } = useContext(Store)
  const {
    userInfo,
    cart: { shippingAddress },
  } = state
  const { location } = shippingAddress
  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping')
    }
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [router, shippingAddress, userInfo, setValue])
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country, location },
    })
    Cookies.set(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location,
      })
    )
    router.push('/payment')
  }
  const chooseLocationHandler = () => {
    const fullName = getValues('fullName')
    const address = getValues('address')
    const city = getValues('city')
    const postalCode = getValues('postalCode')
    const country = getValues('country')
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, city, postalCode, country },
    })
    Cookies.set(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
        location,
      })
    )
    router.push('/map')
  }
  return (
    <Layout title='Shipping Address'>
      <div className={classes.section}>
        <NextLink href='/cart' passHref>
          <Link>
            <IconButton>
              <ArrowBackIosOutlined />
            </IconButton>
          </Link>
        </NextLink>
      </div>
      <CheckOutSteps activeStep={1} />
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Typography component='h1' variant='h1'>
          SHIPPING ADDRESS
        </Typography>
        <List>
          <ListItem>
            <Controller
              name='fullName'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  id='fullName'
                  fullWidth
                  variant='outlined'
                  label='Full Name'
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName
                      ? errors.fullName.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Full Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='address'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  id='address'
                  fullWidth
                  variant='outlined'
                  label='Address'
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address
                      ? errors.address.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Address is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='city'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  id='city'
                  fullWidth
                  variant='outlined'
                  label='City'
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city
                      ? errors.city.type === 'minLength'
                        ? 'City Name length is more than 1'
                        : 'City is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='postalCode'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  id='postalCode'
                  fullWidth
                  variant='outlined'
                  label='Postal Code'
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode
                      ? errors.postalCode.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Postal Code is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name='country'
              control={control}
              defaultValue=''
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  id='country'
                  fullWidth
                  variant='outlined'
                  label='Country'
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country
                      ? errors.country.type === 'minLength'
                        ? 'Country Name length is more than 1'
                        : 'Country is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button
              variant='contained'
              type='button'
              onClick={chooseLocationHandler}
            >
              Choose on map
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant='contained'
              type='submit'
              fullWidth
              color='primary'
              className={classes.button}
            >
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}

export default Shipping

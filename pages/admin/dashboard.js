import {
  Button,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  ListItemIcon,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import React, { useContext, useEffect, useReducer } from 'react'
import NextLink from 'next/link'
import { Bar } from 'react-chartjs-2'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'
import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'
import { getError } from '../../utils/error'
import axios from 'axios'
import { DescriptionOutlined, GroupAddOutlined, InboxOutlined, PersonOutlineRounded } from '@material-ui/icons'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      state
  }
}

const AdminDashboard = () => {
  const { state } = useContext(Store)
  const router = useRouter()
  const classes = useStyles()
  const { userInfo } = state

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    summary: { salesData: [] },
  })
  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get('/api/admin/summary', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) })
      }
    }
    fetchData()
  }, [router, userInfo])

  return (
    <Layout title='Admin Dashboard'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href='/admin/dashboard' passHref>
                <ListItem selected button component='a'>
                  <ListItemText primary='Admin Dashboard'></ListItemText>
                  <ListItemIcon>
                    <PersonOutlineRounded style={{color: 'teal'}} />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/orders' passHref>
                <ListItem button component='a'>
                  <ListItemText primary='Orders'></ListItemText>
                  <ListItemIcon>
                    <DescriptionOutlined />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/products' passHref>
                <ListItem button component='a'>
                  <ListItemText primary='Products'></ListItemText>
                  <ListItemIcon>
                    <InboxOutlined />
                  </ListItemIcon>
                </ListItem>
              </NextLink>
              <NextLink href='/admin/users' passHref>
                <ListItem button component='a'>
                  <ListItemText primary='Users'></ListItemText>
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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={4} xs={12}>
                      <Card raised>
                        <CardHeader
                          title='Orders'
                          action={
                            <IconButton>
                              <DescriptionOutlined style={{color: 'royalblue'}} />
                            </IconButton>
                          }
                        />
                        <CardContent>
                          <Typography variant='h1'>
                            {summary.ordersCount}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/orders' passHref>
                            <Button color='primary' size='small'>
                              View Orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Card raised>
                        <CardHeader
                          title='Products'
                          action={
                            <IconButton>
                              <InboxOutlined style={{color: 'orangered'}} />
                            </IconButton>
                          }
                        />
                        <CardContent>
                          <Typography variant='h1'>
                            {summary.productsCount}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/products' passHref>
                            <Button color='primary' size='small'>
                              View Products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Card raised>
                        <CardHeader
                          title='Users'
                          action={
                            <IconButton>
                              <GroupAddOutlined style={{color: 'teal'}} />
                            </IconButton>
                          }
                        />
                        <CardContent>
                          <Typography variant='h1'>
                            {summary.usersCount}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink href='/admin/users' passHref>
                            <Button color='primary' size='small'>
                              View Users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <ListItem>
                <Typography component='h1' variant='h1'>
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: 'Sales',
                        backgroundColor: 'rgba(177, 62, 14, 1)',
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                    ],
                  }}
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })

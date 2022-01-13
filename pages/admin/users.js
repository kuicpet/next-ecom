import {
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
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
} from '@material-ui/core'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer } from 'react'
import NextLink from 'next/link'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'
import { Store } from '../../utils/Store'
import useStyles from '../../utils/styles'
import { useSnackbar } from 'notistack'
import { DeleteOutlined, DescriptionOutlined, GroupAddOutlined, InboxOutlined, PersonOutlineRounded } from '@material-ui/icons'

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
        users: action.payload,
        error: '',
      }

    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case 'DELETE_REQUEST':
      return {
        ...state,
        loadingDelete: true,
      }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      }
    case 'DELETE_FAIL':
      return {
        ...state,
        loadingDelete: false,
      }
    case 'DELETE_RESET':
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      }
    default:
      state
      break
  }
}

const AdminUsers = () => {
  const router = useRouter()
  const classes = useStyles()
  const { state } = useContext(Store)
  const { userInfo } = state
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      users: [],
    })
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchUsers = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get('/api/admin/users', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
        console.log(data)
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(error) })
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_SUCCESS' })
    } else {
      fetchUsers()
    }
  }, [successDelete, router, userInfo])
  const deleteHandler = async (userId) => {
    if (!window.confirm('Are you sure')) {
      return
    }
    try {
      dispatch({ type: 'DELETE_REQUEST' })
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      })
      dispatch({ type: 'DELETE_SUCCESS' })
      enqueueSnackbar('User deleted successfully', { variant: 'success' })
    } catch (error) {
      dispatch({ type: 'DELETE_FAIL' })
      enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }
  return (
    <Layout title='Users'>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href='/admin/dashboard' passHref>
                <ListItem button component='a'>
                  <ListItemText primary='Admin Dashboard'></ListItemText>
                  <ListItemIcon>
                    <PersonOutlineRounded />
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
                <ListItem selected button component='a'>
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
                <Grid container alignItems='center'>
                  <Grid item xs={6}>
                    <Typography component='h1' variant='h1'>
                      Users
                    </Typography>
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
                                <Button variant='contained' size='small'>
                                  Edit
                                </Button>
                              </NextLink>{' '}
                              <IconButton
                                variant='contained'
                                size='small'
                                onClick={() => deleteHandler(user._id)}
                              >
                                <DeleteOutlined style={{ color: 'red' }} />
                              </IconButton>
                              {loadingDelete && <CircularProgress />}
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
  )
}

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false })

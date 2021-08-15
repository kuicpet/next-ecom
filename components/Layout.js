import { AppBar, Container, Toolbar, Typography } from '@material-ui/core'
import Head from 'next/head'
import React from 'react'
import useStyles from '../utils/styles'

const Layout = ({ children }) => {
    const classes = useStyles()
    return (
        <div>
            <Head>
                <title>
                    Next-Ecom
                </title>
            </Head>
            <AppBar position='static' className={classes.navbar}>
                <Toolbar>
                    <Typography>Next-Ecom</Typography>
                </Toolbar>
            </AppBar>
            <Container className={classes.main}>
                {children}
            </Container>
            <footer className={classes.footer}>
                All rights reserved Next-Ecom
            </footer>
        </div>
    )
}

export default Layout

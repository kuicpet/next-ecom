import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core'
import NextLink from 'next/link'
import React from 'react'
import Rating from '@material-ui/lab/Rating'
import useStyles from '../utils/styles'

const ProductItem = ({ product, addToCartHandler }) => {
  const classes = useStyles()
  return (
    <Card>
      <NextLink href={`/product/${product.slug}`}>
        <CardActionArea>
          <CardMedia
            component='img'
            image={product.image}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly />
          </CardContent>
        </CardActionArea>
      </NextLink>

      <CardActions>
        <Typography className={classes.marginRight}>${product.price}</Typography>
        <Button
          size='small'
          color='primary'
          onClick={() => addToCartHandler(product)}
          variant='contained'
          className={classes.marginLeft}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductItem

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

const ProductItem = ({ product, addToCartHandler }) => {
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
        <Typography>${product.price}</Typography>
        <Button
          size='small'
          color='primary'
          onClick={() => addToCartHandler(product)}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductItem

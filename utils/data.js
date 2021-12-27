import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'john@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Airpods Wireless Bluetooth Headphones',
      slug: 'airpods-wireless-bluetooth-headphones',
      image: '/images/airpods.jpg',
      description:
        'Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working',
      brand: 'Apple',
      category: 'Electronics',
      price: 89.99,
      countInStock: 3,
      rating: 4.5,
      numReviews: 3,
    },
    {
      name: 'iPhone 11',
      slug: 'iphone-11-pro',
      image: '/images/phone.jpg',
      description:
        'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
      brand: 'Apple',
      category: 'Electronics',
      price: 599.99,
      countInStock: 10,
      rating: 4.0,
      numReviews: 3,
    },
    {
      name: 'Cannon EOS 80D DSLR Camera',
      slug: 'cannon-eos-8od-dslr-camera',
      image: '/images/camera.jpg',
      description:
        'Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design',
      brand: 'Cannon',
      category: 'Electronics',
      price: 929.99,
      countInStock: 0,
      rating: 3,
      numReviews: 7,
    },
    {
      name: 'Sony Playstation 4 Pro White Version',
      slug: 'sony-playstation-4-pro-white-version',
      image: '/images/playstation.jpg',
      description:
        'The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music',
      brand: 'Sony',
      category: 'Electronics',
      price: 399.99,
      countInStock: 10,
      rating: 5,
      numReviews: 6,
    },
    {
      name: 'Logitech G-Series Gaming Mouse',
      slug: 'logitech-g-series-gaming-mouse',
      image: '/images/mouse.jpg',
      description:
        'Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience',
      brand: 'Logitech',
      category: 'Electronics',
      price: 49.99,
      countInStock: 7,
      rating: 4.5,
      numReviews: 8,
    },
    {
      name: 'Amazon Echo Dot 3rd Generation',
      slug: 'amazon-echo-dot-3rd-generation',
      image: '/images/alexa.jpg',
      description:
        'Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space',
      brand: 'Amazon',
      category: 'Electronics',
      price: 29.99,
      countInStock: 0,
      rating: 2,
      numReviews: 2,
    },
  ],
};

export default data;

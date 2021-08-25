import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#000',
    '& a': {
      color: '#fff',
      marginLeft: 10,
    },
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    color: '#fff',
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
  },
  navbarBtn: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  error: {
    color: '#f04040',
  },
  fullWidth: {
    width: '100%',
  },
  padding: {
    padding: '0 1rem'
  }
});

export default useStyles;

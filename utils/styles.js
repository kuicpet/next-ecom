import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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
    cursor: 'pointer',
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
    borderRadius: 50,
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
    textTransform: 'capitalize',
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
  },
  mt1: {
    marginTop: '1rem'
  },
  top: {
    top: '3rem !important'
  },
   // search
   searchSection: {
    display: 'none',
    marginRight: '2rem',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  searchForm: {
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    borderRadius: 50,
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  searchInput: {
    paddingLeft: 25,
    width: '300px',
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  iconButton: {
    backgroundColor: '#f8c040',
    padding: 5,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },
  sort: {
    marginRight: 5,
  },

  fullContainer: { height: '100vh' },
  mapInputBox: {
    position: 'absolute',
    display: 'flex',
    left: 0,
    right: 0,
    margin: '10px auto',
    width: 300,
    height: 40,
    '& input': {
      width: 250,
    },
  },
  // review
  reviewForm: {
    maxWidth: 800,
    width: '100%',
  },
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
}));

export default useStyles;

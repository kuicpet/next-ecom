import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    navbar: {
         backgroundColor: '#000',
         '& a': {
            color: '#fff',
            marginLeft: 10
         }
    },
    main: {
        minHeight: '80vh'
    },
    footer: {
        textAlign: 'center'
    }
})

export default useStyles
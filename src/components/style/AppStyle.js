import { makeStyles } from '@material-ui/core';

const appStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 160,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default appStyle;

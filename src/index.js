import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import AppState from './models/AppState';
import UIState from './models/UIState';
import MathFracPad from './components/MathFracPad';

const store = {
  app: new AppState(),
  ui: new UIState()
};

import './style.css';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import classNames from 'classnames';
import { orange, purple, red } from '@material-ui/core/colors';
import { 
  AppBar, Toolbar, Typography, IconButton, Button,
  Menu, MenuItem
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: orange
  },
  typography: {
    fontFamily: ['-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    suppressDeprecationWarnings: true
  }
});

const styles = theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  appBarSpacer: theme.mixins.toolbar,
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  grow: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto'
  }
});

@inject('store')
@withStyles(styles)
class NavBar extends React.Component {
  state = {
    anchorEl: null
  };
  render() {
    const { store, classes } = this.props;
    const { anchorEl } = this.state;
    let ca = require('./resources/ca.png');
    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              MathFrac v0.1
            </Typography>
            <IconButton 
              aria-owns={anchorEl ? 'menu-appbar' : null}
              aria-haspopup="true"
              color="inherit">
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.appBarSpacer} />
          <MathFracPad width={400} height={400} />
        </div>
      </div>
    );
  }
};

ReactDOM.render(
  <Provider store={store}>
    <div>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
      </MuiThemeProvider>
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('app')
);

module.hot.accept();

import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import PaymentIcon from '@material-ui/icons/Payment';
import FastfoodIcon from '@material-ui/icons/Fastfood';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Link } from 'react-router-dom';
import { HeaderProps } from './interface';

import styles from './styles.module.scss';

import { ROUTES } from 'Constants';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Header = ({
  username,
  children
}: HeaderProps) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    // @ts-ignore
    window.deferredPrompt = e;
    document.getElementById('installBtn')?.classList.toggle('hidden', false);
  })

  const handleInstallAppClick = async () => {
    // @ts-ignore
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    console.log(result);

    // garbage collect the deferredPrompt added 
    // @ts-ignore;
    window.deferredPrompt = null;
    document.getElementById('installBtn')?.classList.toggle('hidden', true);
  }

  const drawer = (
    <div className={styles.drawer}>
      <div>
        <div className={classes.toolbar} />
        <ListItem button key="username">
          <div className={styles.flexWrapper}>
            <p className={styles.username}>{`Hi ${username}`}</p>
            <button id="installBtn" className={styles.installBtn} onClick={handleInstallAppClick}>Install App</button>
          </div>
        </ListItem>
        <Divider />
        <Link className={styles.headerLink} to={ROUTES.HOME}>
          <ListItem button key="home" onClick={handleDrawerToggle}>
            <ListItemIcon><FontAwesomeIcon icon='home' size='lg' /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link className={styles.headerLink} to={ROUTES.TRANSACTION_CATEGORIES}>
          <ListItem button key="transactionCategory" onClick={handleDrawerToggle}>
            <ListItemIcon><FontAwesomeIcon icon='filter' size='lg' /></ListItemIcon>
            <ListItemText primary="Add Category" />
          </ListItem>
        </Link>
        <Link className={styles.headerLink} to={ROUTES.BANK}>
          <ListItem button key="bankaccount" onClick={handleDrawerToggle}>
            <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
            <ListItemText primary="Bank Accounts" />
          </ListItem>
        </Link>
        <Link className={styles.headerLink} to={ROUTES.INVESTMENT}>
          <ListItem button key="investments" onClick={handleDrawerToggle}>
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary="Investments" />
          </ListItem>
        </Link>
        <Link className={styles.headerLink} to={ROUTES.BUDGET}>
          <ListItem button key="budget" onClick={handleDrawerToggle}>
            <ListItemIcon><PaymentIcon /></ListItemIcon>
            <ListItemText primary="Budget" />
          </ListItem>
        </Link>
        <Link className={styles.headerLink} to={ROUTES.FOOD_TRACKER}>
          <ListItem button key="foodtracker" onClick={handleDrawerToggle}>
            <ListItemIcon><FastfoodIcon /></ListItemIcon>
            <ListItemText primary="Food Tracker" />
          </ListItem>
        </Link>
        <Link className={styles.headerLink} to={ROUTES.SPEND_ANALYSIS}>
          <ListItem button key="analysis" onClick={handleDrawerToggle}>
            <ListItemIcon><FontAwesomeIcon icon='chart-bar' size='lg' /></ListItemIcon>
            <ListItemText primary="Spend Analysis" />
          </ListItem>
        </Link>
        <Divider />
      </div>
      <div>
        <ListItem button key="logout" onClick={handleLogout}>
          <ListItemIcon><FontAwesomeIcon icon='sign-out-alt' /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );
  const container = window !== undefined ? () => window.document.body : undefined;
  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Money Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden mdUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.appBar}>
        {children}
      </main>
    </>
  );
}

export default Header;

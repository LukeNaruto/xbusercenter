// import Login from '../views/Login';
import Home from '../views/home';
import InfoEdit from '../views/info-edit';
export default[/* {
  path: '/login',
  name: 'login',
  meta: {
    keepAlive: true
  },
  component: Login
}, */{
  path: '/',
  name: 'home',
  meta: {
    keepAlive: true
  },
  component: Home
},{
  path: '/edit',
  name: 'edit',
  meta: {
    keepAlive: true
  },
  component: InfoEdit
}]

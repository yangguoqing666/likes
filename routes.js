/**
 * Created by zhaobin on 2016/11/7.
 */
//import MainContainer from './main/MainContainer';
//import Login from './auth/auth';

// import DashboardContainer from './dashboard/dashboardcontainer';

// import CourseContainer from './course/CourseContainer';

// import UserContainer from './user/usercontainer';

export default (store, client) => {
  return ({
    //onEnter: requireAuth.bind(this, store),
    path: '/admin',
    component: require('./main/MainContainer').default,
    indexRoute: {onEnter: (nextState, replace) => replace('/admin/dashboard')},
    childRoutes: [
      // { path: '/admin/auth', component: Login },
      require('./login/routes').default,
      // { path: '/admin/dashboard', component: DashboardContainer },
      require('./dashboard/routes').default(store),
      // { path: '/admin/user', component: UserContainer },
      require('./user/routes').default(store),
      // { path: '/admin/course', component: CourseContainer },
      require('./course/routes').default(store),
      require('./opencourse/routes').default(store),
      //require('./class/routes').default(store),
      require('./course/detail/routes').default(store),

      require('./publicecourse/routes').default(store),
      require('./publicecourse/detail/routes').default(store),
      
      require('./class/detail/routes').default(store),

      require('./operate/routes').default(store),
      require('./order/routes').default(store),
      require('./finance/routes').default(store),
      require('./statistics/routes').default(store),
     
      require('./enterprise/routes').default(store),
      require('./enterprise/detail/routes').default(store),
      require('./learnplan/routes').default(store),
      require('./learnplan/detail/routes').default(store),
    ]
  });
};


export function requireAuth(store, nextState, replace) {

  //console.log('getStore='+ JSON.stringify(store.getState()));


  if (store.getState().auth.isAuthenticated) {
    //console.log('have logined=' + store.getState().auth.nickname);
    return;
  }

  //console.log('requireAuth nextState.location.pathname=' + nextState.location.pathname);
  replace({
    pathname: '/admin/login',
    state: {
      nextPathname: nextState.location.pathname
    }
  })
}





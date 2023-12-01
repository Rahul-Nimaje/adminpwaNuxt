// middleware/auth.js

export default function ({ store, redirect, route }) {
  // If the user is logged in, redirect them to the home page
  console.log("storeeeeeeeeee", store.state.user.auth.loggedIn, route);
  if ((!store.state.user.auth.loggedIn && route.path != '/login')) {
    redirect('/login');

    // return redirect('/login');
  }
}

import React, { useState } from "react";
import { Auth } from "./auth";
import PrivateRoute from "../utils/PrivateRoute";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./private/Dashboard";
import About from "./public/About";
import Profile from "./private/Profile";

const Home: React.FC = () => {
  const [headers, setHeaders] = useState<Headers | undefined>();

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Link to="/dashboard">Dashboard</Link>
            <br />
            <Link to="/about">About</Link>
          </Route>
          <Route path="/login">
            <Auth setHeadersValue={setHeaders} />
          </Route>
          <PrivateRoute
            hasAccess={headers !== undefined}
            path="/dashboard"
            fallbackPath="/login"
          >
            <Dashboard headers={headers} setHeaders={setHeaders}/>
          </PrivateRoute>
          <PrivateRoute
              hasAccess={headers !== undefined}
              path="/profile"
              fallbackPath="/login"
          >
            <Profile headers={headers} />
          </PrivateRoute>
          <Route>
            <About />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import Auth from "./Auth";
import PrivateRoute from "./utils/PrivateRoute";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import About from "./About";
import Profile from "./Profile";
import Repository from "./Repository";

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
            <Auth setHeaders={setHeaders} />
          </Route>
          <PrivateRoute
            hasAccess={headers !== undefined}
            path="/dashboard"
            fallbackPath="/login"
          >
            <Dashboard headers={headers} />
          </PrivateRoute>
          <PrivateRoute
            hasAccess={headers !== undefined}
            path="/profile"
            fallbackPath="/login"
            children={<Profile headers={headers} />}
          />
          <PrivateRoute
            hasAccess={headers !== undefined}
            path="/:ownerUsername/:projectName"
            fallbackPath="/login"
            children={<Repository headers={headers} />}
          />
          <Route>
            <About />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Home;

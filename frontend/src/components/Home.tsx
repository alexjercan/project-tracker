import React, { useEffect, useState } from "react";
import { Auth } from "./auth";
import PrivateRoute from "../utils/PrivateRoute";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Dashboard from "./private/Dashboard";
import About from "./public/About";

const Home: React.FC = () => {
  const [headersValue, setHeadersValue] = useState<Headers | undefined>();

  useEffect(() => console.log(headersValue), [headersValue]);

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
            <Auth setHeadersValue={setHeadersValue} />
          </Route>
          <PrivateRoute
            hasAccess={headersValue !== undefined}
            path="/dashboard"
            fallbackPath="/login"
          >
            <Dashboard headers={headersValue} />
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

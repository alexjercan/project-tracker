import React from "react";
import { Route, Redirect } from "react-router-dom";

interface Props {
  hasAccess: boolean;
  path: string;
  fallbackPath: string;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = (props) => {
  return (
    <Route
      render={({ location }) =>
        props.hasAccess ? (
          props.children
        ) : (
          <Redirect
            to={{
              pathname: props.fallbackPath,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

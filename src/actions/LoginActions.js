import AppDispatcher from "dispatchers/AppDispatcher.js";
import Login from "constants/LoginConstants.js";

import ToastActions from "actions/ToastActions";
import TokenContainer from "services/TokenContainer";

import LocalStorage from "services/LocalStorage";

class LoginActions {
  onLoginComplete = () => {};
  onLogoutComplete = () => {};

  loginUser = (jwt, user, securityContext, login) => {
    const savedJwt = LocalStorage.getItem("jwt");

    TokenContainer.set(jwt);

    AppDispatcher.dispatch({
      type: Login.LOGIN_USER,
      payload: {
        jwt,
        user,
        securityContext,
        login
      }
    });

    if (savedJwt !== jwt) {
      LocalStorage.setItem("jwt", jwt);
      LocalStorage.setItem("user", JSON.stringify(user));
      LocalStorage.setItem("security-context", JSON.stringify(securityContext));
    }
    if (login) {
      LocalStorage.setItem("login", login);
    }
    LocalStorage.setItem("created-at", Date.now().toString());
  };

  loginUserIfRemembered = () =>
    // Check is user is remembered
    new Promise((resolve, reject) => {
        this.isUserRemembered()
          .then(({ jwt, user, securityContext }) => {
            const isRemembered = !!jwt && !!user && !!securityContext;
            if (isRemembered) {
              this.loginUser(
                jwt,
                JSON.parse(user),
                JSON.parse(securityContext)
              );
            }
            resolve(isRemembered);
          })
          .catch(e => reject(e));
      }
    );

  isUserRemembered = () =>
    new Promise((resolve, reject) => {
      LocalStorage.getItem("login").then(login => {
        AppDispatcher.dispatch({
          type: Login.RECEIVE_USER_LOGIN,
          payload: {
            login
          }
        });
      });
      LocalStorage.getItem("jwt")
        .then(jwt => {
          LocalStorage.getItem("user")
            .then(user => {
              LocalStorage.getItem("security-context")
                .then(securityContext => {
                  LocalStorage.getItem("login")
                    .then(login => {
                      resolve({
                        jwt,
                        user,
                        securityContext,
                        login
                      });
                    })
                    .catch(e => reject(e));
                })
                .catch(e => reject(e));
            })
            .catch(e => reject(e));
        })
        .catch(e => reject(e));
    });

  logoutUser = () => {
    LocalStorage.removeItem("jwt");
    LocalStorage.removeItem("user");
    LocalStorage.removeItem("security-context");
    LocalStorage.removeItem("created-at");
    AppDispatcher.dispatch({
      type: Login.LOGOUT_USER,
      payload: {}
    });

    this.onLogoutComplete();

    AppDispatcher.dispatch({
      type: "clearAll",
      payload: {}
    });
  };

  logoutIfUnauthorized = (err) => {
    // If the error is Unauthorized, it means that the token isn't valid.
    // So we logout the user to let him reconnect.
    if (err && err.status === 401) {
      LocalStorage.getItem("user").then(user => {
        if (user != null) {
          ToastActions.createToastError(
            "Vous devez être connecté pour accéder à l'application."
          );
          this.logoutUser();
        }
      });
    }
  };
}

export default new LoginActions();

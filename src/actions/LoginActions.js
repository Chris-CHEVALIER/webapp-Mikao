import AppDispatcher from "dispatchers/AppDispatcher.js";
import Login from "constants/LoginConstants.js";

import ToastActions from "actions/ToastActions";
import TokenContainer from "services/TokenContainer";

import LocalStorage from "services/LocalStorage";

class LoginActions {
  onLoginComplete = () => {};
  onLogoutComplete = () => {};

  loginUser = (jwt, login) => {
    const savedJwt = LocalStorage.getItem("jwt");
    TokenContainer.set(jwt);
    // Send the action to login store through the Dispatcher
    AppDispatcher.dispatch({
      type: Login.LOGIN_USER,
      jwt: jwt,
      login: login
    });
    // We save the JWT in localStorage to keep the user authenticated. We’ll learn more about this later.
    if (savedJwt !== jwt) {
      LocalStorage.setItem("jwt", jwt);
    }
    if (login) {
      LocalStorage.setItem("login", login);
    }
  }

  loginUserIfRemembered = () =>
    // Check is user is remembered
    new Promise((resolve, reject) => {
      console.log("loginUserIfRemembered");
      
        this.isUserRemembered()
          .then(({ jwt, user/*, securityContext */}) => {
            const isRemembered = !!jwt /*&& !!user && !!securityContext*/;
            if (isRemembered) {
              this.loginUser(
                jwt,
                //JSON.parse(user),
                //JSON.parse(securityContext)
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
              //LocalStorage.getItem("security-context")
                //.then(securityContext => {
                  LocalStorage.getItem("login")
                    .then(login => {
                      resolve({
                        jwt,
                        user,
                        //securityContext,
                        login
                      });
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
    //LocalStorage.removeItem("security-context");
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

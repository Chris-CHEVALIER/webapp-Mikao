import AppDispatcher from "dispatchers/AppDispatcher.js";
import Login from "constants/LoginConstants.js";

import ToastActions from "actions/ToastActions";
import TokenContainer from "services/TokenContainer";

import LocalStorage from "services/LocalStorage";

class LoginActions {
  onLoginComplete = () => {};
  onLogoutComplete = () => {};

  loginUser = (jwt) => {
    const savedJwt = LocalStorage.getItem("jwt");
    TokenContainer.set(jwt);
    localStorage.setItem('jwt', jwt);
    // Send the action to login store through the Dispatcher
    AppDispatcher.dispatch({
      type: Login.LOGIN_USER,
      jwt: jwt
    });
    // We save the JWT in localStorage to keep the user authenticated. We’ll learn more about this later.
    if (savedJwt !== jwt) {
      LocalStorage.setItem("jwt", jwt);
    }
  }

  loginUserIfRemembered = () =>
    // Check is user is remembered
    new Promise((resolve, reject) => {
        this.isUserRemembered()
          .then(({ accessToken, user/*, securityContext */}) => {
            const isRemembered = !!accessToken && !!user /*&& !!securityContext*/;
            if (isRemembered) {
              this.loginUser(
                accessToken,
                JSON.parse(user),
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
      LocalStorage.getItem("accessToken")
        .then(accessToken => {
          LocalStorage.getItem("user")
            .then(user => {
              //LocalStorage.getItem("security-context")
                //.then(securityContext => {
                  LocalStorage.getItem("login")
                    .then(login => {
                      resolve({
                        accessToken,
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
    LocalStorage.removeItem("accessToken");
    LocalStorage.removeItem("refreshToken");
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

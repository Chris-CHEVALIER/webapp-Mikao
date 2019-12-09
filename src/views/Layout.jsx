import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import ScrollArea from "react-scrollbar";

import { Button, Menu, Icon, Layout, Popover, Avatar } from "antd";

import LoginActions from "actions/LoginActions";
import LoginStore from "stores/LoginStore";

import Home from "views/Home.jsx";
import Configuration from "views/Configuration.jsx";
import Locale from 'locale/LocaleFactory';

const { Header, Content, Sider } = Layout;

export default class AppLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      menuCollapsed: localStorage.getItem("sidebar-collapsed") === "true"
    };
  }

  logout = () => {
    LoginActions.logoutUser();
    this.props.history.push("/login");
  };

  handleMenuClick = e => {
    if (e.key !== this.props.location.pathname) {
      this.props.history.push(e.key);
    }
  };

  onCollapse = collapsed => {
    this.setState({
      menuCollapsed: collapsed
    });
    localStorage.setItem("sidebar-collapsed", collapsed.toString());
  };

  render() {
    const user = LoginStore.getUser();

    const selectedMenu = this.props.location.pathname;

    const firstname = user.firstName.replace(
      /\w\S*/g,
      tStr => tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase()
    );
    const fullName = `${firstname} ${user.lastName.toUpperCase()}`;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.menuCollapsed}
          onCollapse={this.onCollapse}
        >
          <ScrollArea horizontal={false}>
            <Link to="/">
              <img
                src="images/logo.png" // @TODO: Update logo image to "images" folder
                style={{ width: "100%", paddingBottom: "1rem" }}
                alt="logo"
              />
            </Link>

            <Menu
              theme="dark"
              onClick={this.handleMenuClick}
              selectedKeys={[selectedMenu]}
              mode="inline"
            >
              <Menu.Item key="/">
                <Icon type="home"/>
                <span>Accueil</span>
              </Menu.Item>
                <Menu.Item key="/configuration">
                  <Icon type="setting"/>
                  <span>Configuration</span>
                </Menu.Item>
            </Menu>
          </ScrollArea>
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: this.state.menuCollapsed ? "130px" : "250px"
            }}
          >
            <div className="welcome-message">Bonjour {fullName}</div>
            <Popover
              overlayClassName="layout-user-menu"
              content={
                <React.Fragment>
                  <Button icon="logout" onClick={this.logout}>
                    {Locale.trans("login.logOut.button")}
                  </Button>
                </React.Fragment>
              }
              title={null}
              placement="bottomRight"
            >
              <Avatar size="large" className="profile-btn">
                {user.firstName.charAt(0).toUpperCase()}
                {user.lastName.charAt(0).toUpperCase()}
              </Avatar>
            </Popover>
          </Header>
          <Content
            style={{ marginLeft: this.state.menuCollapsed ? "80px" : "200px" }}
          >
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/configuration" component={Configuration} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

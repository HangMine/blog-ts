import React, { PureComponent } from "react";
import { Menu, Icon, Layout } from "antd";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import "@css/Aside.scss";

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;

class Aside extends PureComponent {
  render() {
    return (
      <Sider>
        <Logo
          icon={
            <svg
              className="icon"
              style={{
                fontSize: 100,
              }}
            >
              <use xlinkHref="#icon-shizi" />
            </svg>
          }
          title="HangMine"
        />
        <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline" theme="dark" className="h-menu">
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="layout" />
                <span> 客户端 </span>
              </span>
            }
          >
            <Menu.Item key="5">
              <Icon type="home" />
              <Link to='/app/home'> 首页 </Link>
            </Menu.Item>

          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="laptop" />
                <span> 管理端 </span>
              </span>
            }
          >
            <Menu.Item key="9">
              <Icon type="form" />
              <Link to='/app/manage'> 写文章 </Link>
            </Menu.Item>

          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default Aside;

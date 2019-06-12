import React, { PureComponent } from "react";
import { Menu, Icon, Layout } from "antd";
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
          title="有梦想的攻城狮"
        />
        <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline" theme="dark" className="h-menu">
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span> Navigation One </span>
              </span>
            }
          >
            <Menu.Item key="5">
              <Icon type="pie-chart" />
              <span> 菜单五 </span>
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="pie-chart" />
              <span> 菜单六 </span>
            </Menu.Item>
            <Menu.Item key="7">
              <Icon type="pie-chart" />
              <span> 菜单七 </span>
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="pie-chart" />
              <span> 菜单八 </span>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span> Navigation Two </span>
              </span>
            }
          >
            <Menu.Item key="9">
              <Icon type="pie-chart" />
              <span> 菜单九 </span>
            </Menu.Item>
            <Menu.Item key="10">
              <Icon type="pie-chart" />
              <span> 菜单十 </span>
            </Menu.Item>
            <Menu.Item key="11">
              <Icon type="pie-chart" />
              <span> 菜单十一 </span>
            </Menu.Item>
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="appstore" />
                  <span> Navigation Two2 </span>
                </span>
              }
            >
              <Menu.Item key="12">
                <Icon type="pie-chart" />
                <span> 菜单十二 </span>
              </Menu.Item>
              <Menu.Item key="13">
                <Icon type="pie-chart" />
                <span> 菜单十三 </span>
              </Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default Aside;

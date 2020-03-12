import * as React from "react";
import { HeaderBar, AvatarLink, NavLabel } from "./AppBar.style";
import { AvatarBg } from "../../Components/Elements";
import { UserAchievementContext } from "../../Home/Authed/Authed";
import { Flex, Box } from "rebass";
import { MenuIcon } from "../../../shared/icons";
import { UserInvitePopUp } from "../UserInvitePopUp/UserInvitePopUp";
import { SpotifyLogoLink } from "../../../shared/SpotifyLogoLink/SpotifyLogoLink";
import { Menu, Badge, Icon, Popover, Tag } from "antd";
import { mapSizesToProps } from "../../../lib/mapSizes";
import withSizes from "react-sizes";

export interface AppBarProps {
  className: string;
  isMobile: boolean;
}

const AB: React.SFC<any> = ({ className, isMobile }) => {
  const {
    isOpen,
    setSideBarOpen,
    currentUser,
    appNotifications
  }: any = React.useContext(UserAchievementContext);
  const [visible, setVisible]: any = React.useState(false);
  const [notificationsVisible, setNotificationsVisible]: any = React.useState(
    false
  );
  const [localNotifications, setLocalNotifications]: any = React.useState(
    false
  );

  const spotifyURL = `https://open.spotify.com/user/${
    currentUser.uid.split(":")[1]
  }`;

  const toggle = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    setVisible((visible: any) => !visible);
  };

  const toggleNotifications = (e: any) => {
    if (e) {
      e.preventDefault();
    }
    setNotificationsVisible(
      (notificationsVisible: any) => !notificationsVisible
    );
  };

  // React.useEffect(() => {
  //     setLocalNotifications(appNotifications)
  // })

  return (
    <HeaderBar className={className}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Menu mode="horizontal">
            <Menu.Item key="profile">
              <AvatarLink to="/profile" id="AppBarAvatarLink">
                <AvatarBg
                  id="AppBarAvatar"
                  sideNav={true}
                  src={
                    currentUser.photoURL
                      ? currentUser.photoURL
                      : "/icons/headphones.svg"
                  }
                />
              </AvatarLink>
            </Menu.Item>
            <Menu.Item key="invite">
              <UserInvitePopUp
                toggle={toggle}
                isMobile={isMobile}
                visible={visible}
                currentUserName={currentUser.displayName}
              />
            </Menu.Item>
            <Menu.Item key="spotify-link">
              <SpotifyLogoLink href={spotifyURL} />
              {isMobile ? null : "Listen on Spotify"}
            </Menu.Item>
            <Menu.Item key="achievements">
              <Popover
                content={
                  <p>
                    - Capture your week, month, or life in music by tapping the
                    "share" button.
                    <br />- Take a screenshot and share it wherever you want!
                    <br />
                    <img src={require("../../../shared/images/share2.gif")} />
                  </p>
                }
                title={
                  <p style={{ margin: 0 }}>
                    <Tag color="blue">New Feature!</Tag> Your top artists in a
                    shareable image.
                  </p>
                }
                trigger="click"
                visible={notificationsVisible}
              >
                <span onClick={toggleNotifications}>
                  <Badge
                    count={
                      1
                      // <StarOutlined style={{ color: "#f5222d" }} />
                    }
                  >
                    <Icon type="notification" />
                  </Badge>
                </span>
              </Popover>
            </Menu.Item>
          </Menu>
        </Box>
        <Box
          style={{ cursor: "pointer", padding: "0.85rem 1rem" }}
          onClick={() => setSideBarOpen((isOpen: any) => !isOpen)}
        >
          <MenuIcon />
        </Box>
      </Flex>
    </HeaderBar>
  );
};

export const AppBar: any = withSizes(mapSizesToProps)(AB);

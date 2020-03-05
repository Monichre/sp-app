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
                    Introducing our new share feature!
                    <br />
                    Share your week, month, or life in music. Take a screenshot
                    and share it wherever you want!
                  </p>
                }
                title={
                  <p style={{ margin: 0 }}>
                    New Feature! <Tag color="blue">Beta</Tag>
                  </p>
                }
                trigger="click"
                visible={notificationsVisible}
              >
                <span onClick={toggleNotifications}>
                  <Badge
                    count={
                      localNotifications && localNotifications.total
                        ? localNotifications.total
                        : 0
                    }
                    color="#e64a19"
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

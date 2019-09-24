import * as React from 'react';
import { PageHeader, Menu, Dropdown, Badge, Icon, Button, Tag, Typography, Row } from 'antd';
import img from './projections.svg'

const { Paragraph }: any = Typography;

const menu: any = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
      </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
      </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
      </a>
        </Menu.Item>
    </Menu>
);

const DropdownMenu: any = () => {
    return (
        <Dropdown key="more" overlay={menu}>
            <Button
                style={{
                    border: 'none',
                    padding: 0,
                }}
            >
                <Icon
                    type="ellipsis"
                    style={{
                        fontSize: 20,
                        verticalAlign: 'top',
                    }}
                />
            </Button>
        </Dropdown>
    );
};


const IconLink: any = ({ src, text }: any) => (
    <a
        style={{
            marginRight: 16,
            display: 'flex',
            alignItems: 'center',
        }}
    >
        <img
            style={{
                marginRight: 8,
            }}
            src={src}
            alt="start"
        />
        {text}
    </a>
);



const Content: any = ({ children, extraContent }: any) => {
    return (
        <Row className="content" type="flex">
            <div className="main" style={{ flex: 1 }}>
                {children}
            </div>
            <div
                className="extra"
                style={{
                    marginLeft: 80,
                }}
            >
                {extraContent}
            </div>
        </Row>
    );
};

export interface AchievementsSideBarHeaderProps {
    currentUser: any
}

export const AchievementsSideBarHeader: React.SFC<AchievementsSideBarHeaderProps> = ({currentUser}) => {
    return (
        // @ts-ignore
        <PageHeader
            title="Achievements"
            subTitle="Introducing our Artist and Genre Leaders"
            tags={<Tag color="blue">Beta</Tag>}
            avatar={currentUser.photoURL ? currentUser.photoURL : '/icons/headphones.svg'}
        >
            <Content
                extraContent={
                    <img
                        src={img}
                        alt="content"
                    />
                }
            >
                
            </Content>
        </PageHeader>);
}


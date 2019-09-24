import React from 'react';
import { Container } from '../../../shared/ui';
import {  Drawer, Alert, Tabs } from 'antd';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { mapSizesToProps } from '../../../lib/mapSizes'
import withSizes from 'react-sizes'
import {SidebarSection} from './SideBarSection'

import { AchievementsSideBarHeader } from './AchievementsSideBarHeader'

const { TabPane } = Tabs;


export interface SideBarProps {
    isMobile: boolean
}

const SB: React.SFC<SideBarProps> = ({ isMobile }) => {
    const {
        achievements,
        isOpen,
        setSideBarOpen,
        currentUser
    } = React.useContext(UserAchievementContext)
    
    const onClose = () => setSideBarOpen((isOpen: any) => !isOpen)
    const description = `Congratulations ${currentUser.displayName}! You have earned the following achievements for these artists.`

    console.count('SideBar Render Count:')

    return (

        <Drawer
            width={isMobile ? '75%' : '50%'}
            placement="right"
            onClose={onClose}
            bodyStyle={{
                background: '#030616',
                height: '100%'
            }}
            visible={isOpen}
        >
            <Container sideBar={true}>

                {/* <AchievementsSideBarHeader currentUser={currentUser} /> */}

                {achievements && <Tabs defaultActiveKey="1" tabPosition={'left'} style={{ height: '100%' }}>

                    {Object.keys(achievements).reverse().map((period: any, i: any) => {
                        const periodAchievements: any = achievements[period]

                        if (periodAchievements && periodAchievements.length) {

                            const achievementContext = period === 'life' ? 'lifetime achievements' : `achievements this ${period}`
                            const title = `Your ${achievementContext}`

                            return (
                                <TabPane tab={period} key={i}>
                                    <SidebarSection key={`mobile_sidebar_section_${i}`} achievements={periodAchievements} period={period} title={title} currentUser={currentUser} i={i} />
                                </TabPane>
                            )
                        }
                    })}

                </Tabs>}
            </Container>
        </Drawer>

    );
}

export const SideBar: any = withSizes(mapSizesToProps)(SB)
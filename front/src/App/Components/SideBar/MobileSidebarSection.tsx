import * as React from 'react';
import styled from 'styled-components';
import { Tree, Icon, Collapse, Tabs } from 'antd';
import { FirstPlaceBadge, SecondPlaceBadge, ThirdPlaceBadge } from '../Badge'
import { AchievementMetaData } from '../UserAchievementsList/achievements-utils';
import { User } from '../../../../../back/src/fns/graphql/types';
import { firstPlaceBadge } from '../Elements'
import { decimalToHrsMins } from '../../../lib/durationFormats';

import 'antd/es/tree/style/css'
import 'antd/es/collapse/style/css'
import 'antd/es/tabs/style/css'
import 'antd/es/icon/style/css'


const { TreeNode } = Tree;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const badgeStyle = {
    height: '26px',
    width: '26px'
}

const TreeWrap: any = styled(Tree)`
    padding: 0;

    span, li, div, ul {
        color: #fff;
    }
.ant-tree-child-tree {
    padding-left: 0;
}
    ul {
        padding-left: 0;
        li {
            color: #fff;
            padding-left: 0;
        }
    }
    .ant-tree-node-content-wrapper {
        .ant-tree-iconEle {
            /* display: none; */
        }
    }
    .ant-tree-title {
        margin-left: 10px;
    }
    .node-title {
        .ant-tree-node-content-wrapper {
            padding-left: 20px;
            &.ant-tree-node-content-wrapper-open {
            .ant-tree-iconEle.ant-tree-icon__open {
                display: none;
            }
        }
        }
       
    }
`

export interface MobileSidebarSectionProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
    isMobile: boolean
    i: any
}

// export const MobileSidebarSection: React.SFC<MobileSidebarSectionProps> = ({ isMobile, achievements, period, title, currentUser }) => {
//     return (
//         <TreeWrap
//             showIcon
//             defaultExpandAll={period === 'life'}
//             switcherIcon={<Icon type="down" />}
//         >
//             <TreeNode title={title} key={`0-0`} id={`${period}-node-title`} className='node-title'>
//                 {achievements.map((achievementData: AchievementMetaData, index: number) => {
//                     const { artistData, achievement }: any = achievementData
//                     const {personal} = artistData
//                     const formattedTotal = decimalToHrsMins(personal)
//                     console.log('TCL: achievement', achievement)
//                     const { artist: { name, images } } = artistData
//                     const artistIMG = images[0] ? images[0].url : ''

//                     return (
//                         <TreeNode
//                             icon={<img src={artistIMG} height={24} width={24} style={{ borderRadius: '50%' }} />}
//                             title={name}
//                             key={`0-0-${index}`}
//                         >
//                             <TreeNode
//                                 icon={<img src={firstPlaceBadge} height={24} width={24} style={{ borderRadius: '50%' }} />}
//                                 title={`${formattedTotal} mins of  ${name}`}
//                                 key={`0-0-${index}-1`}
//                             />

//                         </TreeNode>

//                     )
//                 })}

//             </TreeNode>
//         </TreeWrap>
//     );
// }


export const MobileSidebarSection: React.SFC<MobileSidebarSectionProps> = ({ isMobile, achievements, period, title, currentUser, i }) => {
    return (
        <Collapse defaultActiveKey="1">
            {achievements.map((achievementData: AchievementMetaData, index: number) => {
                const { artistData, achievement }: any = achievementData
                const { personal } = artistData
                const formattedTotal = decimalToHrsMins(personal)
                console.log('TCL: achievement', achievement)
                const { artist: { name, images } } = artistData
                const artistIMG = images[0] ? images[0].url : ''

                return (
                    <Panel header={name} key="1">
                        <p><img src={firstPlaceBadge} height={24} width={24} style={{ borderRadius: '50%' }} /> {`${formattedTotal} mins of  ${name}`}</p>
                    </Panel>
                )
            })}
        </Collapse>
    );
}
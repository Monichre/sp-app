import styled, { css } from 'styled-components';
import { Badge } from 'antd';
import { AvatarBg } from '../Elements';

export const TopListeners = styled.div`
  display: flex;
  @media (max-width: 800px) {
    display: flex;
    flex-direction: column;
  }
`

export const Badge2 = styled(Badge)`
@media (max-width: 800px) {
  margin-left: 75px !important;
}
@media (max-width: 600px) {
  margin-left: 0px !important;
}
`

export const Img = styled(AvatarBg)`
@media (max-width: 600px) {
  
}
`
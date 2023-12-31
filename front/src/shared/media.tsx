import React from 'react';
import styled, { css } from 'styled-components'
import Responsive from 'react-responsive'

const BP_SMALL_MEDIUM = 500
const BP_MEDIUM_LARGE = 1000
const BP_LARGE_XLARGE = 1300

export const xLargeQuery = (first: any, ...args: any) => css`
@media (min-width: ${BP_LARGE_XLARGE+1}px) {
  ${css(first, ...args)}
}
`
export const largeNotXLargeQuery = (first: any, ...args: any) => css`
  @media (min-width: ${BP_MEDIUM_LARGE+1}px) and (max-width: ${BP_LARGE_XLARGE}px) {
    ${css(first, ...args)}
  }
`

export const largeQuery = (first: any, ...args: any) => css`
  @media (min-width: ${BP_MEDIUM_LARGE+1}px) {
    ${css(first, ...args)}
  }
`
export const notLargeQuery = (first: any, ...args: any) => css`
  @media (max-width: ${BP_MEDIUM_LARGE}px) {
    ${css(first, ...args)}
  }
`

export const Large: React.SFC = props => <Responsive {...props} minWidth={BP_MEDIUM_LARGE+1}/>
export const Medium: React.SFC = props => <Responsive {...props} minWidth={BP_SMALL_MEDIUM+1} maxWidth={BP_MEDIUM_LARGE}/>
export const Small: React.SFC = props => <Responsive {...props} maxWidth={BP_SMALL_MEDIUM}/>
export const NotLarge: React.SFC = props => <Responsive {...props} maxWidth={BP_MEDIUM_LARGE}/>

export const BRAND_COLOR = '#64d6ee'
// #64d6ee
export const BRAND_PERSONAL_COLOR = 'rgba(100, 214, 238, 1)'
export const BRAND_PERSONAL_COLOR_BACKGROUND = '#50E3C2'
export const BRAND_PERSONAL_COLOR_BACKGROUND_INACTIVE = 'rgb(122, 172, 183)'

// #67BF72
export const BRAND_GLOBAL_COLOR = '#C036D0'
export const BRAND_GLOBAL_COLOR_BACKGROUND = 'rgba(192, 54, 208, 1)'
export const BRAND_GLOBAL_COLOR_BACKGROUND_INACTIVE = 'rgba(192, 54, 208, .5)'
// export const BRAND_GLOBAL_COLOR_BACKGROUND = 'linear-gradient(134deg, #C036D0 0 %, #E33C7A 52 %, #FFBF99 100 %)'
// export const BRAND_GLOBAL_COLOR_BACKGROUND_INACTIVE = 'rgba(0, 0, 0, .05)'


export const BODY_FONT = 'Source Sans Pro'
export const TITLE_FONT = 'Open Sans Condensed'

// background - image: linear-gradient(134deg, #C036D0 0 %, #E33C7A 52 %, #FFBF99 100 %);


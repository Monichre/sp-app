import React from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { BackLink } from '../../../shared/BackLink';

const LeftRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`

const Title = styled.div`
  font-weight: 500;
  font-size: 3rem;
  @media (max-width: 800px) {
    font-size: 2rem;
  }
`

const Page = styled.div`
padding: 2rem;
`

const TitleBlock = styled.div`
  display: flex;
  & > * {
    margin-right: 0.5rem;
  }
`

const Content = styled.div`
  line-height: 140%;
  h1 {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.2rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #64d6ee;
  
  }
`

export const MarkdownPage: React.SFC<{title: string, content: string}> = ({title, content}) =>
    <Page>
      <TitleBlock>
        <BackLink/>
        <Title>{title}</Title>
      </TitleBlock>
      <Content>
        <ReactMarkdown {...{source: content}}/>
      </Content>
    </Page>
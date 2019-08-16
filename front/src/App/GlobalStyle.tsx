import { createGlobalStyle } from "styled-components"
import { BODY_FONT } from "../shared/media";

export const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
  html {
    height: 100%;
    background-color: #030616;
    
  }
  #root {
    height: auto!important;
    min-height: 100vh;
    background-color: #030616;
  }
  body {
    font-family: "${BODY_FONT}", sans-serif!important;
    color: #fff;
    background-color: #030616;
    background-image: url(/dots.png);
    background-repeat: repeat;
    background-size: 20px 20px;
    background-blend-mode: color-dodge;
    height: 100vh;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    z-index: 10;
  }
  a, h1, h2, p {
    color: white!important;
  }

  h1, h2 {
    margin: 0;
  }
`
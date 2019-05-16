import { createGlobalStyle } from "styled-components"
import { BODY_FONT } from "../shared/media";

export const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    font-family: "${BODY_FONT}", sans-serif;
    color: #fff;
    background-color: #121519;
    background-image: url(/dots.png);
    background-repeat: repeat;
    background-size: 20px 20px;
    background-blend-mode: color-dodge;
    max-height: 100vh;
    height: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 10;
  }
  a {
    color: white;
  }
`
import * as React from 'react';
import { Component } from 'react';

import styled from 'styled-components';

const MenuIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 6px;
  z-index: 999;
  i {
    font-size: 40px;
    color: $brand-color;
    filter: drop-shadow(4px 4px 10px rgba(0,0,0,.5));
  }

`
const ArtistCardImg: any = styled.div`
  width:100%;
  height:380px;
 background: ${(props: any) => `url(${props.src})`};
 /*background-size: contain;*/
  background-size: cover;
  z-index:111 !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, 
			color-stop(0.00,  rgba(0,0,0,1)),
			color-stop(0.35,  rgba(0,0,0,1)),
			color-stop(0.50,  rgba(0,0,0,1)),
			color-stop(0.65,  rgba(0,0,0,1)),
			color-stop(0.85,  rgba(0,0,0,0.6)),
      color-stop(1.00,  rgba(0,0,0,0)));

  position:relative;


`

const ArtistGraphicCard = styled.div`
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+39,1e1b26+53&0+38,1+55 */
background: -moz-linear-gradient(top,  rgba(255,255,255,0) 38%, rgba(255,255,255,0.06) 39%, rgba(30,27,38,0.88) 53%, rgba(30,27,38,1) 55%); /* FF3.6-15 */
background: -webkit-linear-gradient(top,  rgba(255,255,255,0) 38%,rgba(255,255,255,0.06) 39%,rgba(30,27,38,0.88) 53%,rgba(30,27,38,1) 55%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  rgba(255,255,255,0) 38%,rgba(255,255,255,0.06) 39%,rgba(30,27,38,0.88) 53%,rgba(30,27,38,1) 55%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#1e1b26',GradientType=0 ); /* IE6-9 */

  position:absolute;
  background-size: contain;
  background-size: cover;
  z-index:1 !important;
  width:375px;
  height:660px;
  display:block;
  border-radius:4px;


.text-movie-cont{
  padding:0px 12px;
  text-align: justify;
}

.action-btn{
  text-align:right;
  i{
  color:$brand-color;
  font-size:28px;
  text-align:right;
  }  
}

.watch-btn {
  h3{
    i{
      font-size:14px;
      margin-right:2px;
      position: relative;
      float: left;
      line-height: 1;
    }
  }
  display:block;
  border:1px solid $brand-color;
  border-radius:5px;
  padding:4px;
  width:140px;
}

.action-row{
  margin-top:24px;
}

.summary-row{margin-top:12px;}


$light: 300;
$regular: 400;
$semi-bold: 600;
$bold: 700;
$font-regular: 400;
$mont-bold: 700;

$text-movie-title:36px;
$text-summary:12px;
$text-action-btn:14px;
$text-movie-description:12px;

h1,h2,h3,h4,h5 {
  font-family:$heading-font-family;
  color:$accent-color;
  margin:0px;
}

h1 {
  font-size:$text-movie-title;
  font-weight:$font-regular;
}

h3 {
  font-size:$text-action-btn;
  font-weight:$font-regular;
  color:$brand-color;
}

h5 {
  font-size:$text-summary;
  font-weight:$font-regular;
}

.artistGraphicCaerd-gen{
  margin:0px;
  padding:0px;
    li{
    font-family:$paragraph-font-family;
    font-size:$text-summary;
    color:darken( $accent-color, 40% );
    width:auto;
    display:block;
    float:left;  
    margin-right:6px;
    font-weight:$semi-bold;
  }
}

.artistGraphicCard-likes{
  @extend .artistGraphicCard-gen;
  float:right;
  li{
    color:$brand-color;
    &:last-child {
        margin-right: 0px;
    }
    i{
      font-size:14px;
      margin-right:4px;
      position: relative;
      float: left;
      line-height: 1;
    }
  }  
}

.artistGraphicCard-details {
  font-family:$paragraph-font-family;
  font-size:$text-summary;
  font-weight:$light;
  color:darken( $accent-color, 20% );
  @extend .elements-distance;
}

.artistGraphicCard-description {
  font-family:$paragraph-font-family;
  font-size:$text-movie-description;
  font-weight:$regular;
  color:darken( $accent-color, 30% );  
  @extend .elements-distance;
  text-align: justify;
}

.artistGraphicCard-actors {
  font-family:$paragraph-font-family;
  font-size:$text-summary;
  font-weight:$light;
  color:$accent-color;
  font-style: italic;
  @extend .elements-distance;
}

/* TYPOGRAPHY ENDS */

/** GRID STARTS **/

.thegrid { margin: 0 auto; }

.elements-distance{margin:0px}

.mr-grid { width: 100%; }
    .mr-grid:before, .mr-grid:after { content: ""; display: table; }
    .mr-grid:after { clear: both; }
    .mr-grid { *zoom: 1; }

.col1, .col2, .col3, .col3rest, .col4, .col4rest, .col5, .col5rest, .col6, .col6rest{ 
	margin:0% 0.5% 0.5% 0.5%;
    padding:1%;
    float: left;
    display: block;
}

/* Columns match, minus margin sum. E.G. margin-left+margin-right=1%, col2=50%-1% - added padding:1%*/

.col1 { width: 98%; }
.col2 { width: 47%; }
.col3 { width: 30.3333333333%; }
.col4 { width: 22%; }
.col5 { width: 17%; }
.col6 {width:13.6666666667%;}

	
/* Columns match with their individual number. E.G. col3+col3rest=full width row */

.col3rest { width: 63.6666666667%; }
.col4rest { width: 72%; }
.col5rest { width: 77%; }
.col6rest { width: 80.3333333333%;}


`

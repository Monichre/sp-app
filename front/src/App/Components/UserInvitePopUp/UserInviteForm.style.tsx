import styled, {css} from 'styled-components';

export const EmailInput: any = styled.input`
 width: 100%;
    height: 45px;
    padding: 0 1rem;
    margin-top: 1rem;
    box-sizing: border-box;
    font: inherit;
    border-radius: 0.2rem;
    border: 2px solid #d4d5d6;
    color: #565656;
    -webkit-appearance: none;

    &:focus {
        border-color: cornflowerblue;
        outline: none;
    }

    ${(props: any) => props.error && css`
        border-color: tomato;
    `}
`

export const FormWrap: any = styled.form`
    min-width: 385px
`

export const ButtonMenu: any = styled.div`
display: flex;
width: 100%;
padding: 18px;

p, button {
    width: max-content!important;
    outline: none!important;
    background: none!important;
    margin: 0 10px;
    padding: 4px 8px;
    border: 1px solid #64d6ee;
    border-radius: 3px;

    
}
`

  
export const TagItem: any = styled.div`
background-color: rgba(216,216,216,.05);
    display: inline-block;
    font-size: 14px;
    border-radius: 30px;
    height: 30px;
    padding: 0 4px 0 1rem;
    display: inline-flex;
    align-items: center;
    margin: 0 0.3rem 0.3rem 0;

    button {
    background-color: transparent;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid #64d6ee;
    color: #64d6ee;
    cursor: pointer;
    font: inherit;
    margin-left: 10px;
    font-weight: bold;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

`
  
export const EmailError: any = styled.p`
    margin: 0;
    font-size: 90%;
    color: tomato;
 `
  
  
  
  
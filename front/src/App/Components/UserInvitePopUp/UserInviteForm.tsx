import React, { useState } from "react";
import { EmailInput, TagItem, EmailError, FormWrap, ButtonMenu } from './UserInviteForm.style'
import emailjs from 'emailjs-com'
import { notification } from 'antd';
import {TitleBar, AddButton} from './UserInviteForm.style';
import 'antd/es/notification/style/css'


let service_id = "default_service";
let template_id = "template_bJuUCi2k";
let accountId = 'user_LQXsc7LmTiRs3W0OZBUEA'


export interface UserInviteFormProps {
    close: Function
    currentUserName: string
}

export interface AddIconProps {

}

export interface SendIconProps {

}

export const SendIcon: React.SFC<SendIconProps> = () => {
    return (
        <svg style={{marginRight: '10px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64d6ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    );
}

export const AddIcon: React.SFC<AddIconProps> = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64d6ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    );
}


const openNotificationWithIcon = (type: string, data: any) => {
    console.log('TCL: openNotificationWithIcon -> notification', notification)

    // @ts-ignore
    notification.open({
      message: data.message,
      description: data.description
    });
  };
  

export const UserInviteForm: React.SFC<UserInviteFormProps> = ({ close, currentUserName }) => {
    const [currentAddress, setCurrentAddress]: any = useState(null)
    const [addresses, addAddress]: any = useState([])

    const handleClose = (e: any) => {
        alert('Handling Close!')
        e.preventDefault()
        e.stopPropagation()
        close()
    }


    const handleChange = (evt: any) => setCurrentAddress(evt.target.value)

    const handleDelete = (e: any, item: any) => {
        e.preventDefault()
        
        const a = addresses && addresses.length ? [...addresses] : []
        const newArr = a.length ? a.filter(add => add !== item) : []

        addAddress((addresses: any) => newArr)
     
    };

  

    // const isValid = (email: any) => {
    //     let error = null;

    //     if (isInList(email)) {
    //         error = `${email} has already been added.`;
    //     }

    //     if (!isEmail(email)) {
    //         error = `${email} is not a valid email address.`;
    //     }

    //     if (error) {
    //         setState({ error });

    //         return false;
    //     }

    //     return true;
    // }

    // const isInList = (email: any) => {
    //     return state.items.includes(email);
    // }

    // const isEmail = (email: any) => {
    //     return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    // }

    const handleAdd = () => {
        addAddress((addresses: any) => [...addresses, currentAddress])
        setCurrentAddress('')
        // isValid(value)
    }
    

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        setCurrentAddress('')

        await Promise.all(addresses.map(async (address: any) => {
            currentUserName
            const templateParams = {
                "from_name": currentUserName,
                "user_email": address,
            }
            const status = await emailjs.send(service_id, template_id, templateParams, accountId)

            if (status) {
                const data = {
                    message: 'Congrats! Your invitations have been sent successfully!',
                    description: `You've invited ${addresses.toString()}`
                }
                openNotificationWithIcon('success', data)
            }
        }))

        close()
    
    }

    return (
        <FormWrap onSubmit={handleSubmit}>
            {addresses && addresses.length ? addresses.map((item: any) => (
                <TagItem key={`${item}_tag`}>
                    {item}
                    <button onClick={(e) => handleDelete(e, item)}>&times;</button>
                </TagItem>
            )) : null}

            <EmailInput
                value={currentAddress}
                placeholder="Type or paste email addresses and press `Enter`..."
                onChange={handleChange}
            />

            {/* {state.error && <EmailError>{state.error}</EmailError>} */}
            <ButtonMenu>
                <AddButton onClick={handleAdd}> <AddIcon /></AddButton>
                <button type='submit'><SendIcon /><span>Send</span></button>
            </ButtonMenu>

        </FormWrap>
    );
}



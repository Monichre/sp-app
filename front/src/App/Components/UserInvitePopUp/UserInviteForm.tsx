import React, { useState } from "react";
import { EmailInput, TagItem, EmailError, FormWrap, ButtonMenu, PopConfirmWrap } from './UserInviteForm.style'
import emailjs from 'emailjs-com'
import { notification, Popconfirm } from 'antd';
import { TitleBar, AddButton } from './UserInviteForm.style';


let service_id = "default_service";
let template_id = "template_bJuUCi2k";
let accountId = 'user_LQXsc7LmTiRs3W0OZBUEA'


export interface UserInviteFormProps {
    close: Function
    currentUserName: string
}

export interface AddIconProps {
    strokeLinecap: any
    strokeLinejoin: any
}

export interface SendIconProps {
    strokeLinecap: any
    strokeLinejoin: any
}

export const SendIcon: any = () => {
    return (
        // @ts-ignore
        <svg style={{ marginRight: '10px' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64d6ee" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    );
}

export const AddIcon: any = () => {
    return (
        // @ts-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64d6ee" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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


export interface SendWithConfirmationProps {
    handleConfirm: any
    handleCancel: any
}

const SendWithConfirmation: React.SFC<SendWithConfirmationProps> = ({ handleConfirm, handleCancel }) => {
    return (
        <PopConfirmWrap>
        <Popconfirm
            className='UserInviteConfirm'
            title={<p style={{color: 'white'}}>Hey! You haven't entered any email address</p>}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            okText="My bad"
            cancelText="Cancel Invite"
        >
            <button type='submit'><SendIcon /><span>Send</span></button>
            </Popconfirm>
            </PopConfirmWrap>

    );
}


export const UserInviteForm: React.SFC<UserInviteFormProps> = ({ close, currentUserName }) => {
    const [currentAddress, setCurrentAddress]: any = useState('')
    const [addresses, addAddress]: any = useState([])
    const [tryAgain, setTryAgain]: any = useState(false)
    const [errorOccured, setErrorOccured]: any = useState(false)
    const [errorMessage, setErrorMessage]: any = useState(null)

    const handleChange = (evt: any) => setCurrentAddress(evt.target.value)

    const handleDelete = (e: any, item: any) => {
        e.preventDefault()

        const a = addresses && addresses.length ? [...addresses] : []
        const newArr = a.length ? a.filter(add => add !== item) : []

        addAddress((addresses: any) => newArr)

    };


    const handleConfirm = () => setTryAgain(true)
    const handleCancel = () => {
        setCurrentAddress('')
        close()
    }


    const isValid = (email: any) => {
        let error = false

        if (isInList(email)) {
            setErrorOccured(true)
            setErrorMessage(`${email} has already been added.`)
        }

        if (!isEmail(email)) {
            setErrorOccured(true)
            setErrorMessage(`${email} is not a valid email address.`)
        }

        if (error) {
            setErrorOccured(error)
        }

        return !error
    }

    const isInList = (email: any) => addresses.includes(email)
    const isEmail = (email: any) => /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email)

    const handleAdd = () => {
        if (isValid(currentAddress)) {
            addAddress((addresses: any) => [...addresses, currentAddress])
            setCurrentAddress('')
        }
    }

   
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!addresses.length && currentAddress.length) {
            console.log('TCL: handleSubmit -> addresses', addresses)
            const templateParams = {
                "from_name": currentUserName,
                "user_email": currentAddress,
            }
            const status = await emailjs.send(service_id, template_id, templateParams, accountId)
            console.log('TCL: handleSubmit -> status', status)

            if (status) {
                const data = {
                    message: 'Congrats! Your invitations have been sent successfully!',
                    description: `You've invited ${addresses.toString()}`
                }
                openNotificationWithIcon('success', data)
            }

            return close()
        }

        if (addresses.length) {
            await Promise.all(addresses.map(async (address: any) => {
            
                const templateParams = {
                    "from_name": currentUserName,
                    "user_email": address,
                }
                const status = await emailjs.send(service_id, template_id, templateParams, accountId)
                console.log('TCL: handleSubmit -> status', status)
    
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
    }

    return (
        <div>
            <p><i>Note: Only friends with Spotify accounts can join Soundpruf</i></p>
            <FormWrap onSubmit={handleSubmit}>
                {addresses && addresses.length ? addresses.map((item: any) => (
                    <TagItem key={`${item}_tag`}>
                        {item}
                        <button onClick={(e) => handleDelete(e, item)}>&times;</button>
                    </TagItem>
                )) : null}

                <EmailInput
                    value={currentAddress}
                    placeholder="Enter an email address and press `Enter`..."
                    onChange={handleChange}
                />

                {errorOccured && <EmailError>{errorMessage}</EmailError>}

                <ButtonMenu>
                    <AddButton onClick={handleAdd}> <AddIcon /></AddButton>

                    {addresses.length || !addresses.length && currentAddress.length ? <button type='submit'><SendIcon /><span>Send</span></button> : <SendWithConfirmation handleConfirm={handleConfirm} handleCancel={handleCancel} />}

                </ButtonMenu>

            </FormWrap>
        </div>
    );
}



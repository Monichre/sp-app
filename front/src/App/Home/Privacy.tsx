import React from 'react'
import { MarkdownPage } from './MarkdownPage';
  
const CONTENT = `
Protecting your private information is our priority. This Statement of Privacy applies to app.soundpruf.com and Soundpruf Inc. and governs data collection and usage. For the purposes of this Privacy Policy, unless otherwise noted, all references to Soundpruf Inc. include live.soundpruf.com, Soundpruf and soundpruf.com. The Soundpruf website is a music analytics site. By using the Soundpruf website, you consent to the data practices described in this statement. 
  
# Collection of your Personal Information 
In order to better provide you with products and services offered on our Site, Soundpruf may collect personally identifiable information, such as your: 
  
-	First and Last Name 
-	E-mail Address 
  
We do not collect any personal information about you unless you voluntarily provide it to us. However, you may be required to provide certain personal information to us when you elect to use certain products or services available on the Site. These may include: (a) registering for an account on our Site; (b) entering a sweepstakes or contest sponsored by us or one of our partners; (c) signing up for special offers from selected third parties; (d) sending us an email message; (e) submitting your credit card or other payment information when ordering and purchasing products and services on our Site. To wit, we will use your information for, but not limited to, communicating with you in relation to services and/or products you have requested from us. We also may gather additional personal or non-personal information in the future. 
  
# Use of your Personal Information 
Soundpruf collects and uses your personal information to operate its website(s) and deliver the services you have requested. 
  
Soundpruf may also use your personally identifiable information to inform you of other products or services available from Soundpruf and its affiliates. 
  
# Sharing Information with Third Parties 
Soundpruf does not sell, rent or lease its customer lists to third parties. 
  
Soundpruf may share data with trusted partners to help perform statistical analysis, send you email or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services to Soundpruf, and they are required to maintain the confidentiality of your information. 
  
Soundpruf may disclose your personal information, without notice, if required to do so by law or in the good faith belief that such action is necessary to: (a) conform to the edicts of the law or comply with legal process served on Soundpruf or the site; (b) protect and defend the rights or property of Soundpruf; and/or (c) act under exigent circumstances to protect the personal safety of users of Soundpruf, or the public. 
  
# Tracking User Behavior 
Soundpruf may keep track of the websites and pages our users visit within Soundpruf, in order to determine what Soundpruf services are the most popular. This data is used to deliver customized content and advertising within Soundpruf to customers whose behavior indicates that they are interested in a particular subject area. 
  
We use heat-mapping and mouse-click data to better understand what features website users visit most. 
  
# Automatically Collected Information 
Information about your computer hardware and software may be automatically collected by Soundpruf. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the Soundpruf website. 
  
# Use of Cookies 
The Soundpruf website may use "cookies" to help you personalize your online experience. A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you. 
  
One of the primary purposes of cookies is to provide a convenience feature to save you time. The purpose of a cookie is to tell the Web server that you have returned to a specific page. For example, if you personalize Soundpruf pages, or register with Soundpruf site or services, a cookie helps Soundpruf to recall your specific information on subsequent visits. This simplifies the process of recording your personal information, such as billing addresses, shipping addresses, and so on. When you return to the same Soundpruf website, the information you previously provided can be retrieved, so you can easily use the Soundpruf features that you customized. 
  
You have the ability to accept or decline cookies. Most Web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of the Soundpruf services or websites you visit. 
  
# Links 
This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information. 
  
# Children Under Thirteen 
Soundpruf does not knowingly collect personally identifiable information from children under the age of thirteen. If you are under the age of thirteen, you must ask your parent or guardian for permission to use this website. 
  
# Disconnecting your Soundpruf Account from Third Party Websites 
You will be able to connect your Soundpruf account to third party accounts. BY CONNECTING YOUR SOUNDPRUF ACCOUNT TO YOUR THIRD PARTY ACCOUNT, YOU ACKNOWLEDGE AND AGREE THAT YOU ARE CONSENTING TO THE CONTINUOUS RELEASE OF INFORMATION ABOUT YOU TO OTHERS (IN ACCORDANCE WITH YOUR PRIVACY SETTINGS ON THOSE THIRD PARTY SITES). IF YOU DO NOT WANT INFORMATION ABOUT YOU, INCLUDING PERSONALLY IDENTIFYING INFORMATION, TO BE SHARED IN THIS MANNER, DO NOT USE THIS FEATURE. You may disconnect your account from a third party account at any time. Users may contact us via email to learn how to disconnect their accounts from third-party websites. 
  
# E-mail Communications 
From time to time, Soundpruf may contact you via email for the purpose of providing announcements, promotional offers, alerts, confirmations, surveys, and/or other general communication. In order to improve our Services, we may receive a notification when you open an email from Soundpruf or click on a link therein. 
  
If you would like to stop receiving marketing or promotional communications via email from Soundpruf, you may opt out of such communications by clicking on the UNSUBSCRIBE button. 
  
# Changes to this Statement 
Soundpruf reserves the right to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account, by placing a prominent notice on our site, and/or by updating any privacy information on this page. Your continued use of the Site and/or Services available through this Site after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy. 
  
# Contact Information 
Soundpruf welcomes your questions or comments regarding this Statement of Privacy. If you believe that Soundpruf has not adhered to this Statement, please contact Soundpruf at: 
  
Soundpruf Inc. 
2744 Lyndale Ave S 
Minneapolis, Minnesota 55408 
  
Email Address: 
userfeedback@soundpruf.com 
  
Effective as of April 16, 2019 
  
`
export const Privacy: React.SFC = () =>
  <MarkdownPage title='Privacy Policy' content={CONTENT}/>
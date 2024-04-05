// TermsPage.js

import React from 'react';
import './css/TermsPage.css';
import './css/bootstrap.min.css';
import Header from './Header';

const TermsPage = () => {
  return (
    <div >
      {/* <div className="container-fluid" style={{ borderBottom: 'solid 1px black' }}>
        <div className="pic">
          <div className="row">
            <div className="col-lg-2">
            <div className="logo">
                  <Link to="/">
                    <img src={logo} alt="Description" />
                  </Link>
                </div>
                </div><div className='col-lg-10'>
              <button className="btn text-white" style={{ height: '40px', marginTop: '30px', marginLeft: '935px', backgroundColor: '#539c9f' }} onClick={goBack}>
                <i className="fa fa-backward text-white"></i> Back
              </button>
            </div>
          </div>
        </div>
      </div> */}
<Header />
      <div className="container mt-4 border border-1 border-primary  rounded" >
        <h5 className="text-center hdclr">Privacy Policy of FABRO ROOMS</h5>
        <p className="privacy-text">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The privacy and security of your information are very important to us. Whether you are booking a room or just a prospective client browsing our website (the “Site”) and looking at our property/services, we want you to trust that the information that you have provided to us is being properly managed and protected. This Privacy Policy is issued by The Ivey’s Hotel (the “Hotel”), which includes its parents, subsidiaries, and affiliates, and covers information collected and used by the Hotel in the course of its business. Your information may be collected and used by the Hotel through your use of this Site. We have prepared this Privacy Policy to explain more about how we collect and manage your information.<br/>

          <b className="" style={{ fontSize: '15px' }}>What information you need to give in to use this Website/apps?</b><br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Information you give us. In your use of the Site, you may provide us with various information that personally identifies you. For example, we collect information from you when you make a booking through our reservation system or stay at the Hotel. Information collected during the course of the reservation and during your stay may include:

          Your name, email address, home and business address, phone number, nationality and payment card information; and
          Information such as stay and room preferences made during the course of your reservation such as your preferred room type and specific requests to the Hotel.
          This information may be provided to us directly when you make a reservation through our reservation system, through our websites, directly at the hotel, or through mobile applications. In some cases, we may receive this information from a third party, such as when you book through an online travel agency or hotel booking site.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We use a secure server for credit card transactions to protect the credit card information of our users and Cookies are used to store the login information. Cookies are small files placed on your hard drive that will assist us in providing our services. You may also encounter Cookies or identical/related devices on certain pages of the website/apps that are placed by third parties. We do not control the use of cookies by third parties.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you establish a credit account with us to pay the fees we charge, some additional information, including a billing address, a credit/debit card number and a credit/debit card expiration date and tracking information from cheques or demand drafts is collected.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The user information we collect depends on the context of your interactions with us and the website or Apps, the choices you make and the products and features you use. The User Information is used for authentication and account access, If a user registers using social networking platforms such as Facebook, Google, LinkedIn and others we may collect personal data you choose to allow us to access through their APIs. When the user accesses our websites or apps, data relating to device ID, log files, Geographic Location, device Information/specification are also collected automatically.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We may use also your personal information for verification, analysis of data, usage trends and to evaluate and improve our site/App, marketing research, preventing of frauds. In our efforts to continually improve our product and service offerings, we collect and analyze demographic and profile data about our users' activity on our website/apps. We identify and use your IP address to help diagnose problems with our server, and to administer our website/apps. Your IP address is also used to help identify you and to gather broad demographic information.<br/>

          <b className="" style={{ fontSize: '15px' }}>How the website/apps uses the information it collects/tracks?</b><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; FABRO ROOMS.com collects information for data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and

 improve our websites or apps, products, and services, marketing research from our users primarily to ensure that we are able to fulfill your requirements and to deliver Personalized experience.<br/>

          <b className="" style={{ fontSize: '15px' }}>For European Union Members (EU)</b><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you are located in the EU, you will be asked to provide consent to the collection, processing, and sharing of your personal information. Personal information means any information related to an identified or identifiable natural person. You have the right to share and access your personal information and the right to withdraw consent for sharing your personal information at any point in time and the right to erase your personal information subject to applicable laws. for sharing your personal information at any point in time. You can withdraw your consent provided by contacting us. Your personal information may be stored in databases located outside of the EU, including in India. Where we transfer personal data outside of the EU, we either transfer personal information to countries that provide an adequate level of protection or we have appropriate safeguards in place. We may require proof of or need to verify your identity before we can give effect to these rights. To request to review, update, or delete your personal information, please submit a request form by sending an email to privacy@FABROROOMS.com. We may share your information with third parties who are an anti-fraud solution provider(s) located in the UK. They help us to ensure we keep you safe from scammers and fraudsters.<br/>

          <b className="" style={{ fontSize: '15px' }}>With whom the website/apps shares the information it collects/tracks?</b><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We may share such identifiable information with our associates/affiliates/subsidiaries and such associates/affiliates/subsidiaries may market to you as a result of such sharing. Any information you give us is held with the utmost care and security. We are also bound to cooperate fully should a situation arise where we are required by law or legal process to provide information about a customer/visitor.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Where required or permitted by law, information may be provided to others, such as regulators and law enforcement agencies or to protect the rights, property or personal safety of other members or the general public. We may voluntarily share your information with law enforcement agencies / Gateway service providers / anti-fraud solution provider(s) if we feel that the transaction is of suspicious nature.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;From time to time, we may consider corporate transactions such as a merger, acquisition, reorganization, asset sale, or similar. In these instances, we may transfer or allow access to information to enable the assessment and undertaking of that transaction. If we buy or sell any business or assets, personal information may be transferred to third parties involved in the transaction.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Our website/apps links to other website/apps that may collect personally identifiable information about you. We are not responsible for the privacy policy or the contents of those linked website/apps.<br/>

          <b className="" style={{ fontSize: '15px' }}>How Long Do We Keep Your Information?</b><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As stipulated in the Privacy Policy, we will retain the information we collect from users under the following circumstances:
          For as long as the users subscribe to our services to meet their suitable purpose(s) for which it was collected, for the sake of enforcing agreements, for performing audits, for resolving any form of disputes, for establishing legal defenses, for pursuing legitimate businesses and to comply with the relevant applicable laws.<br/>

          <b className="" style={{ fontSize: '15px' }}>What are the Security Precautions in respect of your personal information?</b><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate internal control measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Once your information is in our possession, we adhere to security guidelines protecting it against unauthorized access.<br/>

          <b className="" style={{ fontSize: '15px' }}>Change of Privacy Policy</b><br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We may change this Privacy Policy from time to time without any notice to you. However, changes will be updated on the Privacy Policy page.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;How to address your Grievance: The Grievance officer: Mr. Anand Vasudev. Address; FABRO ROOMS.com Limited, Contact details: 94, TVH Belciaa Towers, Tower-2, 5th Floor, MRC Nagar, Chennai 600 028 grievanceofficer@FABROROOMS.com<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Grievance officer shall be available between 10 am to 6 pm IST from Monday to Saturday excluding Sundays and Public Holidays in India.<br/>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Grievance officer is appointed as per Section 5 (9) of the Information Technology (Reasonable Security & Procedures and Sensitive Personal data or Information) Rule, 2011.
        </p>
      </div><br />
    </div>
  );
};

// const goBack = () => {
//   window.history.back();
// };

export default TermsPage;
import Page from '../../components/Page';
import { Button } from '../../components/button/button';
import {authenticatedAxios} from '../../utils/axios/axios';
import { useState } from 'react';
import notify from '../../utils/notifications';
import bookingImg from "../../images/calendarImg.png"
import settingsImg from "../../images/settingsImg.png"
import { Tooltip } from '../../utils/pageUtils';


export default function Home() {
  let [data, setData] = useState(false);
    return (
      <Page name="">
        {/* <h2 className='text-center mt-4'>Booking management to let you focus on providing great service.</h2> */}
        <Container>
          <p>
            <span className='font-bold text-lg'>In a nutshell</span> 
            <ul className='list-inside list-disc pl-4'>
              <li>Set up your account and define your workdays and hours, upload a profile picture, and customize questions for your clients to answer when they book with you.</li>
              <li>Book appointments through a simple link or QR code. </li>
              <li>They’ll answer the questions you’ve set and see your availability—no personal info involved. </li>
              <li>Booking conversations to easily exchange messages and images to finalize all the details.</li>
              <li>Focus on your art while your clients pick the time that works best for them.</li>
              <li>All the info you need is organized and right at your fingertips</li>
            </ul>
          </p>
        </Container>
        <div className='flex flex-col sm:flex-row mt-4 justify-between gap-2'>
          <div className='w-full sm:w-[80%] flex flex-row items-center justify-center gap-2'>
            <img className="max-w-[80%] max-h-[80%] object-fill border-2 border-black" src={settingsImg} alt="home page"/>
          </div>
          <div className='w-full sm:w-[47.5%]'>
            <Container>
              <ul className='list-decimal list-inside'>
                <p className='text-center font-bold text-lg mb-4'>How it works?</p>
                
                <li>Create an account</li>
                <li>Go to your profile and set your default questions to ask users when they set up a booking.</li>
                <li>Set your work hours and a minimum booking time.</li>
                <li>Generate a booking link or QR code.</li>
                <li>Get clients to visit the link, answer the questions and pick a booking time.</li>
              </ul>
              <br/>
              <p>Your schedule is shown to the users but no other information is provided</p>
            </Container>
          </div>

            <div className='w-full sm:w-[80%] flex flex-row items-center justify-center'>
            <img className="max-w-[50%] max-h-[80%] object-fill border-2 border-black" src={bookingImg} alt="home page"/>
          </div>

        </div>
      </Page>
    );
  }

  let Container = ({title, bookingContent, children}) => {

    return (
      <div className="bg-d2 border-2 border-black p-2 w-full">
        {bookingContent && <Tooltip content={bookingContent}/>}
        <p className="text-center mb-2">{title}</p>
        <div className="flex flex-col gap-2 ">
          {children}
        </div>
      </div>
    )
  }
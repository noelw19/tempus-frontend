/* eslint-disable jsx-a11y/anchor-is-valid */
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import "./index.css"
import DayPicker from "./components/dayPicker";
import { NotSubscriberComponent, Tooltip } from "../../utils/pageUtils";
import { Button } from "../../components/button/button";

import { bookingContent } from "../../utils/tooltipContent";
import notify from "../../utils/notifications";
import { authenticatedAxios } from "../../utils/axios/axios";
import Loader from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { PERMISSION, getUserRoles } from "../../utils/auth0/utils";
import img from "../../images/avatar.png"

export const ProfilePage = () => {
  let [BSettings, setBSettings] = useState(false);
  let [loading, setLoading] = useState(false);
  let [isSubscriber, setIsSubscriber] = useState(null);
  let [profilePic, setProfilePic] = useState(false)
  
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  let notAllowed = !loading && isSubscriber === false;

  

  useEffect(() => {

    try {
      
    

    let checkPerm = async() => {
      let permissions = await getUserRoles(getAccessTokenSilently);
      let sub = permissions.includes(PERMISSION.SUBSCRIBER);
      console.log(sub)
      setIsSubscriber(sub)
    }

    setLoading(true)
    setTimeout(() => {
      authenticatedAxios.GET("/bookingSettings/profilepicture",  (imageData) => {
        // let b = imageData.data.blob();
          // var objectURL = URL.createObjectURL(ii);
          if(!imageData.status || imageData.status !== 500 || imageData.status !== 404) {
            
            const blob = new Blob( [ imageData.data ] );
            const url = URL.createObjectURL( blob );
            console.log(imageData)
            
            setProfilePic(url)
          }

        authenticatedAxios.GET("/bookingSettings", (res) => {
          let settings = res.data.settings;
          
          if(settings) setBSettings(settings)
            setLoading(false)
        })
      }, {responseType:'arraybuffer'})
      }, 1000)
    } catch (error) {
      console.log(error)
    }
  }, [isAuthenticated])
  
  useEffect(() => {
    if(notAllowed) return
    if(!BSettings) return


    let profileEl = document.querySelector("#profilePic");
    profileEl && profileEl.addEventListener("change", (e) => {
      console.log(e.target.files)
      let profilePic = e.target.files[0];
      let nameEl = document.querySelector(".file-name");
      let image = document.querySelector('.profileImage');
      image.src = URL.createObjectURL(profilePic)
      image.style.display = "flex"
      nameEl.textContent = profilePic.name;
    })

      
    let getInput = (str) => {
      return document.querySelector(`.${str}`)
    }
    
    Object.entries(BSettings.workdays).forEach(([k, v]) => {
      let el = getInput(k);
      el.defaultChecked = v === 'true'
    })

    let {startTime, endTime} = BSettings;
    getInput("startTime").defaultValue=startTime
    getInput("endTime").defaultValue=endTime

    Object.entries(BSettings.questions).forEach(([k,v]) => {
      if(!v) return
      if(getInput(k)) {
        getInput(k).defaultValue = v;
      }
    })

    getInput("minBookingNumber").defaultValue = BSettings.minBookingTime;
    
  }, [BSettings])
  
  if (!user) {
    return null;
  }

  let submitHandler = (e) => {
    e.preventDefault();
    let elementCount = e.target.length -2;
    console.log(e.target[0], e.target[1], elementCount)

    let formObject = {};
    formObject.workdays = {};
    formObject.minBookingTime = {};
    formObject.questions = {};
    
    let imageData = new FormData();

    let dayOfweek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    let rawImageFile;

    for(let i = 0; i <= elementCount; i++ ) {
      let elName = e.target[i].name;
      let el = e.target[i]

      if(elName === "profilePic") {
        // console.log(el.files[0])
        // formObject.profilePic = el.files[0]
        imageData.append('profilePic', el.files[0]);
        rawImageFile = el.files[0]
      }
      
      if(dayOfweek.includes(elName)) {
        // if day of week save to object with name for easy ref
        let isChecked = el.checked;
        formObject.workdays[elName] = String(isChecked);
      } 
      if(elName === "startTime" || elName === "endTime") {
        formObject[elName] = el.value;
      }

      if(elName.includes("minBooking")) {
        formObject.minBookingTime = el.value;
      }

      if(elName.includes("question")) {
          formObject.questions[elName] = el.value;
      }
    }
    if(formObject.startTime.split(":")[0] >= formObject.endTime.split(":")[0] && formObject.startTime.split(":")[1] > formObject.endTime.split(":")[1]) {
      notify(4, "No can do", "Your start time should be before your end time.")
      return;
    }

    console.log(formObject)




    
    authenticatedAxios.POST('/bookingSettings/set', formObject, (returned) => {
      let data = returned.data;

      console.log(data)
      notify(2, "Fabulous", "Settings Updated")
      if(rawImageFile) {
        authenticatedAxios.POST('/bookingSettings/profilepicture', imageData, (res) => {
          if(res === undefined) return;
          console.log(res.data)
          let success = "File uploaded!";
          if(res.data === success) {
            notify(2, success);
          } else {
            notify(4, "There was an issue uploading the image. Try Again")
          }
          setTimeout(() => {
              window.location.reload();
          }, 1500)
        })
      }
    })
    
  }

  if(loading) return <Loader />;

  if(notAllowed) return <NotSubscriberComponent />;
console.log(profilePic, user.picture)
  return (
    <Page name="">
          <div className="profile-grid ">
            <div className="flex justify-between gap-4 border-b-2 border-d2 pb-2 w-full">
              <div className="flex gap-4 pb-2">
                <img
                  src={profilePic ? profilePic : user.picture || img}
                  alt="Profile"
                  className="rounded w-[20%]"
                />
                <div className="profile__headline">
                  <p className="profile__title">Name: {user.name}</p>
                  <p>Bookings: 3</p>
                </div>
              </div>
              <div className="flex justify-end h-16">
                <Button text={"Generate"} cb={() => {
                  navigate("/request");
                }}/>
              </div>
            </div>
            <div className="my-2">
              <p className="text-center my-2">Booking Settings</p>

              <form className="flex flex-col sm:flex-row flex-wrap justify-between gap-2" onSubmit={submitHandler}>
                <div className="w-full md:w-[49%] flex flex-col gap-2">

                <SettingContainer title="Profile Settings" bookingContent={"Update your profile picture that will be seen by users when they are in the booking process."}>
                  <div className='flex justify-between gap-2 mt-4 pl-5'>
                    {/* <p>Profile Picture</p> */}
                    <p className="file-name">Profile Picture</p>
                    <label htmlFor="profilePic" className='rounded-lg border-2 border-black p-2 cursor-pointer hover:scale-90 '>Upload Picture</label>
                    <input id='profilePic' name='profilePic' className='absolute left-[-100%]' type='file' />
                  </div>
                  <div className='w-full flex justify-center'>
                    <img className='profileImage w-[30%]' src="#" alt="profile" style={{display: "none"}}/>
                  </div>
                  {/* <div className='flex justify-between gap-2 mt-4 pl-5'>
                    <label>Social Media / Website</label>
                    <input type='text' />

                  </div> */}
                </SettingContainer>

                  <SettingContainer title={"Booking"} bookingContent={bookingContent.settings.bookings}>

                    <label>Workdays</label>
                    <DayPicker />

                    <div className="flex justify-between gap-4">
                      <label>Daily Start Time</label>
                      <input name="startTime" className="w-30 startTime " type="time" />
                    </div>

                    <div className="flex justify-between gap-4">
                      <label>Daily End Time</label>
                      <input name="endTime" className="w-30 endTime" type="time" placeholder="17:00"/>
                    </div>

                    <div className="flex justify-between flex-row">
                      <label>Default Minimum Booking Time</label>
                      <div className="flex justify-end gap-2">
                        <input name="minBookingNumber" className="minBookingNumber w-10" type="number" min="1" max="8" />
                        <p>Hours</p>
                      </div>
                    </div>
                  </SettingContainer>

                </div>

                <div className="w-full md:w-[49%]">
                <SettingContainer title={"Questions"} bookingContent={bookingContent.settings.questions}>
                    <QuestionContainer>
                      <label>Question 1</label>
                      <textarea name="question1" className="question1" rows="5" cols="30" />
                    </QuestionContainer>
                    <QuestionContainer>
                      <label>Question 2</label>
                      <textarea name="question2" className="question2" rows="5" cols="30" />
                    </QuestionContainer>
                    <QuestionContainer>
                      <label>Question 3</label>
                      <textarea name="question3" className="question3" rows="5" cols="30" />
                    </QuestionContainer>
                  </SettingContainer>
                </div>
                <div className="w-full flex justify-center">
                  <Button text={"Submit"} type="submit" />

                </div>
              </form>

            </div>
          </div>
       
    </Page>
  );
};

let SettingContainer = ({title, bookingContent, children}) => {

  return (
    <div className="bg-d2 border-2 border-black p-2">
      <Tooltip content={bookingContent}/>
      <p className="text-center mb-2">{title}</p>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

let QuestionContainer = ({children}) => {
  return (
    <div className="flex justify-between flex-col lg:flex-row">
      {children}
    </div>
  );
}
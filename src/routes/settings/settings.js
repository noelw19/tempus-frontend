import { useEffect } from 'react';
import {PageHeader} from '../../utils/pageUtils'
import { Tooltip } from '../../utils/pageUtils';
import { Button } from '../../components/button/button';

export default function Settings() {


  useEffect(() => {
    let profileEl = document.querySelector("#profilePic");
    profileEl.addEventListener("change", (e) => {
      console.log(e.target.files)
      let profilePic = e.target.files[0];
      let nameEl = document.querySelector(".file-name");
      let image = document.querySelector('.profileImage');
      image.src = URL.createObjectURL(profilePic)
      image.style.display = "flex"
      nameEl.textContent = profilePic.name;
    })
  }, [])

    return (
      <div className='w-full h-full'>
        <PageHeader text="Settings"/>
        <div className='w-full p-5 flex gap-2 flex-col md:flex-row'>
          <div className='md:w-[50%] w-[100%]'>
            <SettingContainer title="Profile Settings" bookingContent={"Profile stuff"}>
              <div className='flex justify-between gap-2 mt-4 pl-5'>
                <p>Profile Picture</p>
                <p className="file-name"></p>
                <label htmlFor="profilePic" className='rounded-lg border-2 border-black p-2 cursor-pointer hover:scale-90 '>Upload Picture</label>
                <input id='profilePic' className='absolute left-[-100%]' type='file' />
              </div>
              <div className='w-full flex justify-center'>
                <img className='profileImage w-[30%]' src="#" alt="profile" style={{display: "none"}}/>
              </div>
              <div className='flex justify-between gap-2 mt-4 pl-5'>
                <label>Social Media / Website</label>
                <input type='text' />

              </div>
            </SettingContainer>
          </div>
          <div className='md:w-[50%] w-[100%]'>
            <SettingContainer title={"Contact"} bookingContent={"We will send you a list of your daily bookings to a place of your choice, or you can opt out."} >

              <div>
                <p>How would you like your bookings to be sent to you?</p>
                <div>
                  <Checkbox label="Email"/>
                  <Checkbox label="Text"/>
                  <Checkbox label="No "/>
                </div>
              </div>
            </SettingContainer>
          </div>
        </div>
        <div className='w-full flex justify-center'>
          <Button text={"Submit"} type="submit" />
        </div>
      </div>
    );
  }

  let SettingContainer = ({title, bookingContent, children}) => {

    return (
      <div className="bg-d2 border-2 border-black p-4">
        <Tooltip content={bookingContent}/>
        <p className="text-center mb-2">{title}</p>
        <div className="flex flex-col gap-2">
          {children}
        </div>
      </div>
    )
  }

let Checkbox = ({label}) => {
  return (
    <div className='flex w-[30%] justify-between my-2'>
      <p>{label}</p>
      <div class="inline-flex items-center">
        <label class="flex items-center cursor-pointer relative">
          <input defaultChecked type="checkbox" class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check-custom-style" />
          <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>
      </div>
    </div>
  )
}
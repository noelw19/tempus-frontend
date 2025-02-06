import { useEffect, useRef, useState } from 'react';
import {PageHeader} from '../../utils/pageUtils'
import { Tooltip } from '../../utils/pageUtils';
import { Button, NavButton } from '../../components/button/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import QRCode from 'qrcode'
import generateQR from '../../utils/qr';
import { authenticatedAxios } from '../../utils/axios/axios';
import Loader from '../../components/loader/loader';
import notify from '../../utils/notifications';

export default function CreateRequest() {
    let [loading, setLoading] = useState(false);
    let [userID, setUserID] = useState(false);
    let [qr, setQr] = useState(false);
    let [settings, setSettings] = useState(false);

    let {isAuthenticated, loginWithRedirect} = useAuth0();
    let navigate = useNavigate();
    let init = useRef(true);
    // TODO
    // on create - create booking request
    // with ID and owner
    // show copyable link or qr

    // link to requestID

    function qrClickHandle(link) {
        generateQR(link, {width: 400,color: {light: "#ffffff"}}).then(qr => {
            fetch(qr)
            .then(async(res) => {
                let blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "tempus_QR.png"); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .then(console.log)
            
        })
    };

    useEffect(() => {

        setLoading(true)
        if(!isAuthenticated) {
            (async () => {
                await loginWithRedirect({
                  appState: {
                    returnTo: window.location.href,
                  },
                });
            })();
        }  else {
            if(init.current) {
                setTimeout(() => {
                    authenticatedAxios.GET("/userID", (response) => {
                        let id = response.data.id;
                        setUserID(id);
    
                        authenticatedAxios.GET("/bookingSettings", (settingsResponse => {
                            setSettings(settingsResponse.data.settings)
                            console.log(settingsResponse.data.settings)
                            generateQR(window.location.href + "/" + id, {width: 200,color: {light: "#d8b589"}}).then(qr => {
                                setQr(qr);
                                init.current = false;
                            })
                            setLoading(false);
                        }))
                    })
                }, 1000);
            }
        }
        
    }, [])

    let tooltip = "Get a user to visit the link or scan the QR and they will be taken to the request page where they can enter details answer questions and book a time to meet."

    if(loading) return <Loader />

    let link = window.location.origin + window.location.pathname + "/" + userID;
    return (
      <div className='w-full h-full p-5 flex justify-center'>
        <SettingContainer title={"Create Request"} bookingContent={tooltip}>
            <div className='w-[80%] flex justify-center flex-col items-center'>
                <a download href="#" onClick={() => qrClickHandle(link)}>
                    <img className="hover:cursor-pointer" src={qr || "#"} id="imgQr" alt="qr"/>
                    </a>
                <div className='w-[80%] flex justify-between'><p>Link:</p> <Tooltip content={"Click link to copy"}/></div>
                <p className='w-[80%] break-all text-center self-center justify-center text-blue-900 hover:text-blue-600 hover:cursor-pointer flex flex-wrap text-wrap' onClick={() => {
                    navigator.clipboard.writeText(link);
                    notify(2, "Success", "Link copied!");
                }}>{userID ? link : "Loading"}</p>
                <div className='w-[80%] my-2'>
                    <p className='my-2'>Current Questions: </p>
                    {settings && Object.entries(settings.questions).map((entry, i) => {
                        return <p className='pl-4 break-words' key={entry[0]}>Question {i + 1}: {entry[1]}</p>
                    })}
                </div>
                <div>
                    <NavButton text="Edit Questions" path={"/profile"}/>
                </div>
            </div>
        </SettingContainer>

          
      </div>
    );
  }

  let SettingContainer = ({title, bookingContent, children}) => {

    return (
      <div className="bg-d2 border-2 border-black p-2 w-[70%] h-fit" >
        <Tooltip content={bookingContent}/>
        <p className="text-center mb-4 text-lg">{title}</p>
        <div className="flex flex-col gap-2 justify-center items-center">
          {children}
        </div>
      </div>
    )
  }


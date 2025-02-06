import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../../utils/pageUtils'
import { Tooltip } from '../../utils/pageUtils';
import { Button, ButtonColored } from '../../components/button/button';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { authenticatedAxios } from '../../utils/axios/axios';
import "./index.css"
import CalendarComponent from '../calender/calenderComponent/calenderComponent';
import Loader from '../../components/loader/loader';
import { clickType } from '../calender/calenderEnums';
import { v4 as uuidv4 } from 'uuid';
import notify from '../../utils/notifications';
import { getUserRoles, PERMISSION } from '../../utils/auth0/utils';
import { dateChecker, dateIsAfterToday } from '../calender/calenderUtils';

let requestStage = {
    INIT: "INIT",
    CALENDER: "CALENDER"
}

export default function Request() {
    let [settings, setSettings] = useState(false);
    let [stage, setStage] = useState(requestStage.INIT);
    let [events, setEvents] = useState([]);
    let [loading, setLoading] = useState(false);
    let [openModal, setOpenModal] = useState(false);
    let [eventDetails, setEventDetails] = useState(false);
    let [details, setDetails] = useState({});
    let [perm, setPerm] = useState(false)

    let { isAuthenticated, loginWithRedirect, user, getIdTokenClaims, getAccessTokenSilently } = useAuth0();
    let { id } = useParams();
    let init = useRef(true)

    useEffect(() => {
        setLoading(true)
        if (!isAuthenticated) {
            (async () => {
                await loginWithRedirect({
                    appState: {
                        returnTo: window.location.href,
                    },
                });
            })();
        } else {
            getUserRoles(getAccessTokenSilently).then(permArray => {
                setPerm(permArray);
            })
            if(init.current) {
                setDetails({owner: id, bookee: user.email, reference: uuidv4()})
                setTimeout(() => {
                    authenticatedAxios.GET("/request/"+id, (res) => {
                        let settings = res.data;
                        setSettings(settings);
                        authenticatedAxios.GET("/request/events/"+id, (response) => {
                            let bookings = response.data;
                            let processedEvents = bookings.map(b => {
                                
                                b.start = new Date(b.start);
                                b.end = new Date(b.end);
                                return b
                            })
                            setEvents(processedEvents)
                            setLoading(false)
                        })
                    })
                    
                    init.current = false;
                }, 1000)
            } else {
                setLoading(false)
            }
        }


    }, [])

    let stageChanger = (type) => {

        let compareSet = (type, next, back) => {
            if(type === "Next") setStage(next)
            else setStage(back)
        }

        switch(stage) {
            case requestStage.INIT: {
                let answers = {}
                let title;
                let titleEl = document.querySelector(`.title`)
                title = titleEl.value;

                Object.entries(settings.questions).forEach((q) => {
                    let questionName = q[0];
                    let el = document.querySelector(`.${q[0]}`)
                    answers[questionName] = el.value;
                })
                let anyFalse = Object.values(answers).filter(str => str[0]).length
                if(anyFalse !== 3 || !title ) {
                    notify(4, "Error", "You must fill in all fields.")
                    break;
                }
                setDetails({...details, questions: answers, title: title});
                compareSet(type, requestStage.CALENDER, null);
                break;
            }
            case requestStage.CALENDER: {

                compareSet(type, requestStage.CALENDER, requestStage.INIT);
                break;
            }
            default: {
                break;
            }
        }
    }
    // check db for id
    // if request = false return false
    // because it has already been actioned

    // has calender with minimal info just bookings or show free times
    // has chat as seperate tab, calendar as tab

    // user must login
    // 3 settings first
    // then view dates and pick a time
    // create chat on sucessful sumbit
    let INIT_STAGE = () => {

        let InputDiv = ({name, label}) => {
            return (
                <div className='flex flex-col justify-between'>
                    <label className='w-[100%] break-words mb-2'>{label}</label>
                    <textarea className={name} rows="5" defaultValue={details.questions && details.questions[name]}/>
                </div>
            )
        }

        return (
            <div className='w-[90%]'>
                <p className='mb-2'>Initial Questions</p>
                <div className='flex flex-col justify-between pl-4'>
                    <label className='w-[100%] break-words mb-2'>Name</label>
                    <input type="text" className={"title"} defaultValue={details.title || ""}/>
                </div>
                {settings && Object.entries(settings.questions).map((q, i) => {
                    return <div className="w-[100%] my-2 pl-4" key={q[0]}>
                        <InputDiv name={q[0]} label={q[1]}/>
                    </div>
                })}
            </div>
        )
    }

    let CALENDER = () => {
        
        return (
            <div className='w-full'>
                <p className='my-2'>Choose a date for your booking</p>
                <p className='text-sm text-red-500'>*Bookings must be atleast 24 hours in advance</p>
                <p className='text-sm text-red-500'>*Booking cannot collide with another booking</p>
                <p className='text-sm text-red-500'>*There is a 30min break period between bookings</p>
                <CalendarComponent request={true} events={events} bookingSettings={settings} isSubscriber={perm.includes(PERMISSION.SUBSCRIBER)} clickEvent={({details, type}) => {
                    if(type === clickType.BOOKING) {
                        let bookingInput = {from: details[0], to: details[details.length-1]}
                        let start_NoCollisions = dateChecker(bookingInput.from, events);
                        let end_NoCollisions = dateChecker(bookingInput.to, events);
                        
                        // console.log("No Collisions: ", (start_NoCollisions && end_NoCollisions))
                        let noCollision = start_NoCollisions && end_NoCollisions;
                        // if date is after today then valid
                        let validDate = dateIsAfterToday(bookingInput.from);
                        if(!noCollision) {
                            notify(4, "Collision", "Pick a time that doesn't collide with another booking.")
                            return
                        } 
                        if(!validDate) {
                            notify(4, "Booking error", "Must choose a booking 24 hours in advance.");
                            return
                        } 
                        setEventDetails(bookingInput);
                        setOpenModal(true);
                    
                    }
                }}/>
            </div>
        )
    }

    if(loading) return <Loader />

    return (
        <div className='w-full h-fit p-2 lg:p-5  flex justify-center pb-4 flex-col items-center'>
            <div>
                    <p>Username</p>
                </div>
            <SettingContainer title={"Booking Request"}>
                <>
                    {requestStage.INIT === stage ? <INIT_STAGE /> : null}
                    {requestStage.CALENDER === stage && <CALENDER />}
                </>
                <div className='flex'>
                    <ButtonColored text={"Back"} disabled={requestStage.INIT === stage} cb={() => {stageChanger("Back")}}/>
                    <ButtonColored text={"Next"} cb={() => {stageChanger("Next")}}/>
                </div>
            </SettingContainer>
            {openModal && <Modal close={() => {setOpenModal(false)}} min={settings.minBookingTime} eventDetails={eventDetails} details={details} setDetails={setDetails}/>}
        </div>
    );
}

let SettingContainer = ({ title, bookingContent, children }) => {
    return (
        <div className="bg-d2 border-2 border-black p-2 w-[70%] h-fit" >
            <Tooltip content={bookingContent} />
            <p className="text-center mb-4 text-lg">{title}</p>
            <div className="flex flex-col gap-2 justify-center items-center">
                {children}
            </div>
        </div>
    )
}

// TODO: Add submit to modal, date changer to modal, collision detection on date changer
let Modal = ({close, eventDetails, setDetails, details, min}) => {
    let {to, from} = eventDetails;

    return (
        <div className="w-full h-full absolute z-20 left-0 top-0 bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-60 ">
        <div className="bg-d2 relative z-20 left-[15%] top-[40%] w-[70%] h-fit p-4 rounded flex flex-col justify-between">
            
            <div className="w-[100%] flex flex-col justify-around gap-2">
                <p className='text-center pb-4 border-b-2 border-black'>Are these details correct?</p>
                <p className='pl-4'>The owner will go through this information before this booking is accepted.</p>
                <div className='flex flex-col justify-center mt-4'>
                    <p className='pl-4'>From: {from.toLocaleString()}</p>
                    <p className='pl-4'>To: {to.toLocaleString()}</p>
                </div>
                <p className='text-xs text-red-500 pl-4'>*Minimum booking time is {min} {Number(min) > 1 ? "Hours" : "Hour"}</p>
            </div>

            <div className="flex justify-end">
                <ButtonColored text="Submit" cb={() => { 
                    let data = {...details, start: from, end: to};
                    authenticatedAxios.POST("/request/create", data, (res) => {
                        if(res.data.status === "Success") {
                            notify(2, "Success", "Booking request created." )
                            setTimeout(() => {
                                window.location.href = window.location.origin;
                            }, 2000)
                        } else {
                            notify(4, "Error", "There was an issue creating this booking request")
                        }
                    })
                }} disabled={false}/>
                <ButtonColored text="Cancel" cb={() => {close()}}/>
            </div>

        </div>
    </div>
    )
}
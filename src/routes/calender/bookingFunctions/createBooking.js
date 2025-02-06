import { toLocalISOString } from "../calenderUtils";
import { v4 as uuidv4 } from 'uuid';
import notify from "../../../utils/notifications";
import { authenticatedAxios, baseAxios } from "../../../utils/axios/axios";
import { clickType } from "../calenderEnums";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../../components/button/button";
import {isEqual} from "lodash"

export let CreateBooking = ({eventDetails, closeModal, submit, type, saveEditedBooking, dateChecker, allEvents}) => {
    let uuid = uuidv4()
    let newBooking = type === clickType.BOOKING;
    let editBooking = type === clickType.EDIT;
    let initialOpen = useRef(true)

    let [dataUpdated, setDataUpdated] = useState(false)
    let [booking, setBooking] = useState({
        // booking title will be user name 
            title: newBooking ? "" : eventDetails.title,
            start: newBooking ? eventDetails[0] : eventDetails.start,
            end: newBooking ? eventDetails[eventDetails.length -1] : eventDetails.end,
            reference: newBooking ? uuid : eventDetails.reference,
            bookee:""
    })

    useEffect(() => {
        let checkingObj = {
            title: newBooking ? "" : eventDetails.title,
            start: newBooking ? eventDetails[0] : eventDetails.start,
            end: newBooking ? eventDetails[eventDetails.length -1] : eventDetails.end,
            reference: booking.reference,
            bookee:""
        }

        if(initialOpen.current) {
            dateCheck("start", newBooking ? eventDetails[0] : eventDetails.start);
            dateCheck("end", newBooking ? eventDetails[eventDetails.length -1] : eventDetails.end);
            initialOpen.current = false;
        }

        // console.log(booking, booking.title === "")
        // let unedited = isEqual(booking, checkingObj)
        // if(booking.title === "") setDataUpdated(false)
        // if(!unedited) {
        //     // data has been edited
        //     setDataUpdated(true)
        // } else {
        //     if(!unedited === dataUpdated) return;

        //     setDataUpdated(false)
        // }
    }, [booking])

    let dateCheck = async(type="start", date) => {
        // console.log(date, booking)
        let ref = booking.reference;
        // if(date === booking[type]) return;
        let el = document.querySelector(`.${type}Date`);
        let collide = dateChecker(date, allEvents, ref)
        if(collide) {
            // opposite here for dataUpdated
            // if(!dataUpdated) {
                setDataUpdated(true)
                el.style.border = "none";
                setBooking({...booking, end: date})
            // }
        } else {
            // opposite here for dataUpdated
            setDataUpdated(false)
            el.style.border = "2px solid red";
            notify(4, "Booking collision", "We can't have colliding bookings")
        }
    }

    let start, end;
    
    if(newBooking) {
        start = eventDetails[0]
        end = eventDetails[eventDetails.length -1]
    } else {
        start = eventDetails.start;
        end = eventDetails.end;
    }

    let submitHandle = () => {
        if(!booking.title) {
            notify(4,"Error", "A booking needs a title");
            return
        }
        
        if(newBooking) {
            authenticatedAxios.POST("/booking/set", booking, (res) => {
                if(res.data.status === "failed") {
                    return;
                }
                let newBooking = res.data.data;
                newBooking.start = new Date(newBooking.start);
                newBooking.end = new Date(newBooking.end);
                submit(newBooking);
                notify(2,"Success", "You've created a booking");
                closeModal();
            })
        }
        if(editBooking) {
            console.log(eventDetails)
            let updatedObj = {};
            Object.keys(booking).forEach((k) => {
                if(eventDetails[k] !== booking[k]) {
                    updatedObj[k] = booking[k]
                }
            })
            updatedObj["_id"] = eventDetails["_id"];
            console.log(updatedObj);

            authenticatedAxios.POST("/booking/update", updatedObj, (res) => {
                if(res.status === "failed") {
                    notify(4,"Error", "There was an issue editing your booking");
                    return;
                }

                saveEditedBooking({...updatedObj, reference: booking.reference});
                notify(2,"Success", "You've edited a booking");
                closeModal();
            })

            // authenticatedAxios.POST("/booking/update", )
        }
    }

    return (
        <div className="w-full h-full absolute z-20 left-0 top-0 bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 ">
            <div className="bg-l2 relative z-20 left-[15%] top-[20%] w-[70%] h-[70%] p-4 rounded flex flex-col justify-between">
                
                <div className="flex flex-col gap-2 justify-center items-center">
                    <p className="text-center py-2 mb-5">Booking Details</p>
                    <div className="flex justify-between md:w-[80%] w-full">
                        <p>Title:</p>
                        <input name="bookingTitle" type='text' placeholder="Booking Title" defaultValue={editBooking ? eventDetails.title : null} onChange={(e) => {setBooking({...booking, title: e.target.value})}}/>
                    </div>
                    <div className="flex justify-between md:w-[80%] w-full">
                        <p>Start:</p>
                        <input className="startDate" type="datetime-local" defaultValue={toLocalISOString(start)} onChange={(e) => {
                                let el = document.querySelector('.startDate');
                                console.log("here")
                                if(dateChecker(e.target.value, allEvents, booking.reference)) {
                                    // opposite here for dataUpdated
                                    setDataUpdated(true)
                                    el.style.border = "none";
                                    setBooking({...booking, start: e.target.value})
                                } else {
                                    // opposite here for dataUpdated
                                    setDataUpdated(false)
                                    el.style.border = "2px solid red";
                                    notify(4, "Booking collision", "We can't have colliding bookings")
                                }
                            }}/>

                    </div>
                    <div className="flex justify-between md:w-[80%] w-full">
                        <p>End:</p>
                        <input className="endDate" type="datetime-local" defaultValue={toLocalISOString(end)} onChange={(e) => {
                                let el = document.querySelector('.endDate');
                                console.log("here")

                                if(dateChecker(e.target.value, allEvents, booking.reference)) {
                                    // opposite here for dataUpdated
                                    setDataUpdated(true)
                                    el.style.border = "none";
                                    setBooking({...booking, end: e.target.value})
                                } else {
                                    // opposite here for dataUpdated
                                    setDataUpdated(false)
                                    el.style.border = "2px solid red";
                                    notify(4, "Booking collision", "We can't have colliding bookings")
                                }
                            }}/>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button text="Submit" cb={submitHandle} disabled={!dataUpdated}/>
                    <Button text="Cancel" cb={() => {closeModal()}}/>
                </div>

            </div>
        </div>
    )
}
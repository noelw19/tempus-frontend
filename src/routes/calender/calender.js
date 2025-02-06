import React, {useCallback, useEffect, useRef, useState} from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Button } from "../../components/button/button";
import { FaBullseye } from "react-icons/fa";
import { clickType } from "./calenderEnums";
import { authenticatedAxios } from "../../utils/axios/axios";

import { CreateBooking } from "./bookingFunctions/createBooking";
import { BookingDetails } from "./bookingFunctions/viewBooking";
import { dateChecker, getAndProcessBookings, getBookingSettings } from "./calenderUtils";
import Loader from "../../components/loader/loader";
import { useAuth0 } from "@auth0/auth0-react";
import CalendarComponent from "./calenderComponent/calenderComponent";
import { getUserRoles } from "../../utils/auth0/utils";

import { PERMISSION } from "../../utils/auth0/utils";



const localizer = momentLocalizer(moment)

const myEventsList = [
    { start: new Date("Date Sat Oct 26 2024 15:16:15 GMT+1300 (New Zealand Daylight Time)"), end: new Date("Date Sat Oct 26 2024 16:16:15 GMT+1300 (New Zealand Daylight Time)"), title: "special event", reference: "test" },
  ];

  const tester = [
    {
      "_id": "6720bde62b7ec32d10b884f8",
      "title": "valid Booking",
      "start": new Date("2024-10-28T20:30:00.000Z"),
      "end": new Date("2024-10-28T23:00:00.000Z"),
      "reference": "266612fe-d248-490e-a717-2d6e7c84576d",
      "owner": "noelw19@outlook.com",
      "bookee": "test bookee",
    },
    // {
    //   "_id": "6720be172b7ec32d10b884fd",
    //   "title": "taha",
    //   "start": "2024-10-28T20:00:00.000Z",
    //   "end": "2024-10-28T23:00:00.000Z",
    //   "reference": "ce49d091-83af-40b9-a1b8-91e764f079a5",
    //   "owner": "noelw19@outlook.com",
    //   "bookee": "test bookee",
    // }
  ]



let otherBookingStuff = () => {
    return (
        <div className="p-2">
            <p className="text-lg text-center border-t-2 border-b-2 border-d2">Today</p>
            <div className="mt-2">
                <p>Bookings today: </p>
                <p>Bookings Remaining: </p>

            </div>
            <div className="flex">
                <Button text="Value" color="bg-d2"/>
                <Button text="Value" color="bg-d2"/>
                <Button text="Value" color="bg-d2"/>
                
            </div>
        </div>
    )
}

const CalenderPage = () => {
    let [events, setEvents] = useState(tester);
    let [eventDetails, setEventDetails] = useState(false);
    let [bookingSettings, setBookingSettings] = useState(false);
    let [loading, setLoading] = useState(false);
    let [isSubscriber, setIsSubscriber] = useState(null);

    let {isAuthenticated, getAccessTokenSilently} = useAuth0();
    // let permissions = await getUserRoles(getAccessTokenSilently)
    
    useEffect(() => {
        let checkPerm = async() => {
            let permissions = await getUserRoles(getAccessTokenSilently);
            let sub = permissions.includes(PERMISSION.SUBSCRIBER);
            setIsSubscriber(sub)
        }

        if(isAuthenticated && !bookingSettings) {
            setLoading(true)
            checkPerm()
            setTimeout(() => {
                getBookingSettings((settings) => {
                    setBookingSettings(settings)
                    getAndProcessBookings((bookings) => {
                        if(bookings.length >= 1) {
                            setEvents(bookings)
                        }
                        setLoading(false)
                    })
                })
            }, 1000)
        }

    }, [isAuthenticated]);

    let closeModal = () => {
        setEventDetails(false)
    }

    let editBooking = () => {
        setEventDetails({...eventDetails, type: clickType.EDIT})
    }

    let deletedBooking = (id) => {
        let filtered = events.filter(e => {
            return e["_id"] !== id
        })
        setEvents(filtered)
    }

    let saveEditedBooking = (booking) => {
        let newEvents = events.map((event) => {
            if(event.reference === booking.reference) {
                return {...event, ...booking}
            } else {
                return event
            }
        })
        setEvents(newEvents)
    }

    let addNewBooking = (booking) => {
        setEvents([...events, booking])
    }

    if(loading) return <Loader />

    return (
        <>
            <CalendarComponent clickEvent={setEventDetails} events={events} bookingSettings={bookingSettings} isSubscriber={isSubscriber}/>
            
            {eventDetails.type === clickType.VIEW && <BookingDetails eventDetails={eventDetails.details} closeModal={closeModal} editBooking={editBooking} deleted={deletedBooking}/>}
            {(eventDetails.type === clickType.BOOKING 
            || eventDetails.type === clickType.EDIT ) && <CreateBooking 
                eventDetails={eventDetails.details} 
                closeModal={closeModal} 
                submit={addNewBooking} 
                type={eventDetails.type} 
                saveEditedBooking={saveEditedBooking}
                allEvents={events}
                dateChecker={dateChecker}
                />}
        </>
    )
}

export default CalenderPage;
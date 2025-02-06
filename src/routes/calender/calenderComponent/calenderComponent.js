import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { useRef, useEffect, useCallback } from "react";
import { clickType } from "../calenderEnums";
import { views } from 'react-big-calendar/lib/utils/constants';

const localizer = momentLocalizer(moment)


const  CalendarComponent = ({events, clickEvent, bookingSettings, isSubscriber, request=false}) => {

    const clickRef = useRef(null)

    useEffect(() => {
        return () => {
        window.clearTimeout(clickRef?.current)
        }
    }, [])

    const onSelectSlot = useCallback((slotInfo) => {

        window.clearTimeout(clickRef?.current)
        clickRef.current = window.setTimeout(() => {
            let min = Number(bookingSettings.minBookingTime) || 1;
            const {slots} = slotInfo;
            // * 2 because calender slot step is 30 min. 1 hour = 2 slots
            let minimumBooking = slots.slice(0, (min * 2) + 1)
            // console.log(minimumBooking.length, minimumBooking)

            clickEvent({details: minimumBooking, type: clickType.BOOKING})
        }, 250)
    }, [])

    let bookingClickHandler = (event) => {
        let currentEvent = events.filter(b => b["_id"] === event["_id"])[0]
        clickEvent({details: currentEvent, type: clickType.VIEW})
    }

    let startTime =  bookingSettings ? bookingSettings.startTime.split(":") : 9;
    let endTime = bookingSettings ? bookingSettings.endTime.split(":") : 17;

    let today = new Date();
    let tomorrow = today.setDate(today.getDate() + 1);

    return (
        <div className="h-full bg-white pt-2 z-10">
            <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={((!isSubscriber && !request)) ? () => {} : onSelectSlot}
            defaultView="day"
            views={request ? ['week', 'day'] : ['week', 'day', 'agenda']}
            defaultDate={request ? tomorrow : today}
            onSelectEvent={bookingClickHandler}
            min={new Date(2024, 1, 0, startTime[0], startTime[1], 0)} 
            max={new Date(2024, 1, 0, endTime[0], endTime[1], 0)}
            selectable
            />
        </div>
    )
}

export default CalendarComponent;
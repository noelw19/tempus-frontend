import { authenticatedAxios, baseAxios } from "../../utils/axios/axios";
import { Button } from "../../components/button/button";
import notify from "../../utils/notifications";

function createEvent(start, end, reference, title) {
    return {start, end, reference, title};

}

function toLocalISOString(date) {
    const localDate = new Date(date - date.getTimezoneOffset() * 60000); //offset in milliseconds. Credit https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
  
    // Optionally remove second/millisecond if needed
    localDate.setSeconds(null);
    localDate.setMilliseconds(null);
    return localDate.toISOString().slice(0, -1);
}

function getAndProcessBookings(callback) {
    return authenticatedAxios.GET("/booking",(bookingResponse) => {
        console.log(bookingResponse)
        if(typeof bookingResponse.data === "string") {
            notify(4, "There was an issue getting your bookings")
            return;
        }
        const bookingArray = bookingResponse.data;
        // setEvents(booki)
        if(!bookingArray) {
            callback(false)
            return;
        }
        let processedBookings = bookingArray.map(booking => {
            let newBooking = {...booking};
            newBooking.start = new Date(booking.start)
            newBooking.end = new Date(booking.end)
            return newBooking
        })
        callback(processedBookings)
    })
}
function getAndProcessBookingsAsync() {
    let bookingResponse = authenticatedAxios.ASYNC_GET("/booking");
        console.log(bookingResponse.data)
        const bookingArray = bookingResponse.data;
        // setEvents(booki)
        if(!bookingArray) {
            
            return [];
        }
        let processedBookings = bookingArray.map(booking => {
            let newBooking = {...booking};
            newBooking.start = new Date(booking.start)
            newBooking.end = new Date(booking.end)
            return newBooking
        })
        return processedBookings;
}

function getBookingSettings(callback) {
    authenticatedAxios.GET("/bookingSettings", (res) => {
        let settings = res.data.settings;
        callback(settings)
    })
}

// Returns true if no collision
let dateChecker = (date, events, ref=null) => {
    let inputDate = new Date(date);

    let filteredEvents = events.filter(d => {
        let startDate = d.start

        if(inputDate.getFullYear() === startDate.getFullYear() &&
        inputDate.getMonth() === startDate.getMonth() &&
        inputDate.getDate() === startDate.getDate() && d.reference !== ref) {
            return startDate;
        }   
    })
    // now we have filtered all events on same day
    // check if times collide
    if(!filteredEvents[0]) return true

    let collide = filteredEvents.map((e) => {
        let getTimes = (date) => [date.getHours(), date.getMinutes()];
        let dateStart = e.start;
        let dateEnd = e.end;

        let start = getTimes(dateStart);
        let end = getTimes(dateEnd);
        let InputTime = getTimes(inputDate);
        
        let FallsOutsideEvent_MINUTES = (InputTime[1] < start[1]) || (InputTime[1] > end[1])
        let FallsOutsideEvent_HOUR = (InputTime[0] < start[0]) || (InputTime[0] > end[0]);

        let startMinCheck = () => {
            // if input time is less than the start time of current event
            return InputTime[1] < start[1]
        }

        let endMinCheck = () => {
            // if input time is greater than the end time of current event
            return InputTime[1] > end[1]
        }

        let hoursMatch = InputTime[0] === start[0];

        let startsBeforeEvent = hoursMatch && startMinCheck();
        let startsAfterEvent = hoursMatch && endMinCheck();

        if(startsBeforeEvent || startsAfterEvent) {
            return false 
        }
        
        if(!FallsOutsideEvent_HOUR && !FallsOutsideEvent_MINUTES) return true

        if(FallsOutsideEvent_HOUR) return false
        return true

    })  

    let collisionCount = collide.filter(c => c === true).length

    // if there is no collision return true else false
    // console.log("collide: ", Boolean(collideLength))
    if(collisionCount === 0) return true
    else return false
}

let dateIsAfterToday = (date) => {
    return new Date(Date.now()) < new Date(date);
}

export {toLocalISOString, getAndProcessBookings, getBookingSettings, dateChecker, dateIsAfterToday}
import React from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, RedButton } from "../../../components/button/button";
import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authenticatedAxios } from "../../../utils/axios/axios";
import notify from "../../../utils/notifications";


export let BookingDetails = ({eventDetails, closeModal, editBooking, deleted}) => {
    let navigate = useNavigate()
    return (
        <div className="w-full h-full absolute z-20 left-0 top-0 bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 ">
            <div className="bg-l2 relative z-20 left-[15%] top-[20%] w-[70%] h-[70%] p-4 rounded flex flex-col justify-between">
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="w-full flex justify-end cursor-pointer hover:text-red-500"><FaTimesCircle onClick={() => {closeModal()}} /></div>

                    <p className="text-center py-2 mb-5">Booking Details</p>
                    <div className="flex justify-between md:w-[80%] w-full">
                        <p>Title:</p>
                        <p>{eventDetails.title}</p>
                    </div>
                    <div className="flex justify-between md:w-[80%] w-full">
                        <p>Start:</p>
                        <p>{new Date(eventDetails.start).toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between md:w-[80%] w-full">
                        <p>End:</p>
                        <p>{new Date(eventDetails.end).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col md:w-[80%] w-full mt-4">
                        <p className="text-center">Reference:</p>
                        <p className="w-full text-center">{eventDetails.reference}</p>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between flex-wrap">
                        <RedButton text="Delete" cb={() => {
                            if(!eventDetails["_id"]) {
                                notify(4, "no id")
                                return;
                            }
                            authenticatedAxios.Delete("/booking/", eventDetails["_id"], (res) => {
                                if(res.data === "success") {
                                    deleted(eventDetails["_id"]);
                                    notify(2, "Successful delete");
                                    closeModal();
                                } else {
                                    notify(4, "Unsuccessful delete")
                                }
                            })
                        }}/>
                        
                        <div className="flex justify-end flex-wrap">
                            <Button text="Edit" cb={() => editBooking()}/>
                            <Button text={"Open"}  cb={() => {
                                navigate("/conversation/"+ eventDetails["_id"])
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
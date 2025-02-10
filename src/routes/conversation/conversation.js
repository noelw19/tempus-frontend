import React, { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { authenticatedAxios } from "../../utils/axios/axios";
import notify from "../../utils/notifications";
import { Button, ButtonColored } from "../../components/button/button";
import Loader from '../../components/loader/loader'
import { useAuth0 } from "@auth0/auth0-react";
import { URLS } from "../../config";
import { FaTimesCircle, FaUpload } from "react-icons/fa";
import { Bubble } from "./bubble/bubble";

let errPage = (
    <div className="w-full h-full bg-l2">
        <div className="w-[50%] h-[40%] absolute top-[30%] left-[30%] bg-d2 rounded-lg p-2">
            <div>
                <p className="w-full text-center">There was an error</p>
            </div>
        </div>
    </div>
)

const ViewMode = {
    MESSAGES: "MESSAGES",
    IMAGES: "IMAGES"
}

let Conversation = () => {
    let {user} = useAuth0()
    let [details, setDetails] = useState(false);
    let [loading, setLoading] = useState(false);
    let [messages, setMessages] = useState(false);
    let [error, setError] = useState(false);
    let [viewMode, setViewMode] = useState(ViewMode.MESSAGES);
    let [imageModal, setImageModal] = useState(false);
    let [images, setImages] = useState(false);
    let {id} = useParams()
    let initRef = useRef(true)
    let initImgRef = useRef(true)
    const divRef = useRef();
    let sameSenders = false;

    const scrollRef = useCallback(node => {
        if (node !== null) {
          node.scrollTop = node.scrollHeight
          
        }
      }, []);


    // useEffect(() => {
    //     let timer = setInterval(() => {
    //         authenticatedAxios.GET("/booking/open/"+id, (res) => {
    //             console.log(res.data)
    //             if(res.data.status === "success") {
    //                 setDetails(res.data);
    //                 sameSenders = res.data.conversation.members[0] === res.data.conversation.members[1];
    //             } else {
    //                 notify(4, res.data.message);
    //             }
    //             setLoading(false);
    //             initRef.current = false;
    //         })
    //     }, 2000)

    //     return () => {
    //         clearInterval(timer)
    //     }
    // }, [])

    useEffect(() => {
        console.log("runnning")
        if(viewMode === ViewMode.MESSAGES) {
            setMessages(details.messages)
        } else if (viewMode === ViewMode.IMAGES) {
            let images = details.messages.filter((m) => {
                if(m.type === "image") return m
            })
            setMessages(images)
        }
    }, [viewMode])

    
    
    useEffect(() => {
        if(!initRef.current) return;
        setLoading(true)
        setTimeout(() => {
            console.log(id);
            
            authenticatedAxios.GET("/booking/open/"+id, (res) => {
                if(!res) return
                console.log(res)
                if(res.data.status === "success") {
                    let {messages, ...rest} = res.data;
                    console.log(res.data)
                    setDetails({...rest, messages});
                    setMessages(messages)
                    sameSenders = res.data.conversation.members[0] === res.data.conversation.members[1];
                    setLoading(false);
                    
                } else {
                    notify(4, res.data.message);
                    setLoading(false);

                }
                initRef.current = false;
                
            })
        }, 1000)
    }, [id])

    useEffect(() => {
        if(!details?.messages || loading || !initImgRef.current) return;

        let {messages, ...rest} = details;
        console.log(messages)
        let all = messages.map(msg => {
            console.log(msg)
            if(msg.type !== "image" || msg.content.includes(URLS.backend) || msg.content.includes(URLS.publicBackend)) return msg;

            let img = {...msg};
            img.content = (msg.content.includes(URLS.backend) ? URLS.backend : URLS.publicBackend) + msg.content;
            return img
        })
        setDetails({...rest, messages: all})
        setMessages(all)
        initImgRef.current = false;

    }, [details]);

    let refreshMessages = () => {
        console.log(id)
        initImgRef.current = true;
        
        try {
            authenticatedAxios.GET("/booking/open/" + id, (res) => {
                console.log(res)
                if (res.data.status === "success") {
                    setDetails(res.data);
                    setMessages(res.data.messages)
                    sameSenders = res.data.conversation.members[0] === res.data.conversation.members[1];
                } else {
                    notify(4, res.data.message);
                }
                setLoading(false);
                initRef.current = false;
            })
        } catch (error) {
            console.log(error)
        }
    }

    
    let QuestionRenderer = () => {
        let Container = ({children}) => {
            return (
                <div className="h-full bg-d2 border-2 border-black p-2 mb-2 md:mb-0">
                    {children}
                </div>
            )
        }
        if(!details.questions || !details.booking.questions) return (
            <Container>
                <p>No Questions saved to this booking</p>
            </Container>
        );

        let questions = details.questions;
        let answers = details.booking.questions;
        let keys = Object.keys(questions);

        return (
            <Container>
                <p className="w-full text-center pb-2">Questions</p>
                {keys.map((key, i) => {
                    return <div key={i} className="m-2 flex flex-row gap-4 md:flex-col">
                        <p className="font-bold">{questions[key]}</p>
                        <p>{answers[key]}</p>
                    </div>
                })}
            </Container>
        )
    }

    let MessagesComponent = () => {

        let fileUpload = (e) => {
            let file = e.target.files[0];
            let url = URL.createObjectURL(file)
            let imageData = new FormData();
            imageData.append('image', file);
            
            // setImages(url)
            // setImageModal(true)

            authenticatedAxios.POST(`/conversation/sendImage/${details.conversation["_id"]}`, imageData, (res) => {
                if(res === undefined) return;
                console.log(res.data)

                if(res.data.status === "success") {
                  notify(2, "Image uploaded successfully");
                  refreshMessages()
                } else {
                  notify(4, "There was an issue uploading the image. Try Again")
                }
                // setTimeout(() => {
                //     window.location.reload();
                // }, 1500)
              })
        }
        
        return (
            <div className="h-[100%]">
                <div ref={scrollRef} className="message-container h-[80%] min-h-[80%] overflow-auto scroll-smooth bg-l2 border-2 border-black shadow-[inset_0_-3px_6px_rgba(0,0,0,0.6)]">
                    {!details.messages ? ""
                        : <div className="w-full p-2">
                            {/* ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"] */}
                            {messages.map((m, i) => {
                                return <Bubble msg={m} user={user} currIndex={i} sameSenders={details.conversation.members[0] === details.conversation.members[1]} refreshMessages={refreshMessages}/>
                            })}
                        </div>}
                </div>
                <div className="w-full mt-2 flex">
                    <div className=' w-[10%] flex mt-2 justify-center'>
                        {/* <p>Profile Picture</p> */}
                        <label htmlFor="profilePic" className='rounded-lg p-2 cursor-pointer hover:scale-90 hover:text-green-700'>
                            <FaUpload size={30}/>
                        </label>
                        <input id='profilePic' name='profilePic' className='absolute left-[-100%]' onChange={(e) => fileUpload(e)} type='file' />
                    </div>
                    <div className="relative w-full min-w-[55%]">
                        <textarea
                            id="messageInput"
                            className="peer h-[90%] min-h-[60px] w-[100%] resize-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                            placeholder=" ">
                        </textarea>
                        <label
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-[100%] select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Message
                        </label>
                    </div>
                    <ButtonColored full={false} text={"Send"} cb={() => {
                        // let validFieldsAreFilled = data.sender && data.type && data.content && data.conversationID;
                        let message = {};
                        let input = document.querySelector("#messageInput").value;
                        if (input.trim() === "") {
                            notify(4, "Empty message")
                            return;
                        }
                        message.content = input;
                        message.type = "message";
                        message.conversationID = details.conversation["_id"];

                        authenticatedAxios.POST("/conversation/send", message, (res) => {
                            console.log(res.data)
                            if (res.data.status === "success") {
                                notify(2, "Message Sent")
                                refreshMessages()
                            } else {
                                notify(4, "Message not sent");
                            }
                        })

                    }} />
                </div>
            </div>
        )
    }

    let ImageModal = () => {
        return (
            <div className="absolute left-0 bg-red-300 opacity-30 w-full h-full">
                <p>akfbaf</p>
                <Button text="click" cb={() => setImageModal(false)}/>
            </div>
        )
    }

    let ImagesComponent = () => {

        

        return (
            <div className="h-full ">
                <div ref={scrollRef} className="message-container h-[300px] min-h-[60%] overflow-auto scroll-smooth">
                    <div className={`w-full mt-2 mb-2 flex`}>
                        <div className={` break-words text-xs sm:text-sm md:text-base w-fit max-w-[70%] sm:max-w-[50%] flex`}>
                            {images && (
                                <div className="w-[30%] m-2">
                                    <img className="cursor-pointer" onClick={() => {window.open(images, {target: "_blank"})}} src={images}/>
                                </div>)}
                        </div>
                    </div>
                </div>
                <div className=' w-full flex mt-2 justify-center'>
                    {/* <p>Profile Picture</p> */}
                    <label htmlFor="profilePic" className='rounded-lg border-2 border-black p-2 cursor-pointer hover:scale-90 '>Upload Picture</label>
                    <input id='profilePic' name='profilePic' className='absolute left-[-100%]' onChange={(e) => {}} type='file' />
                </div>
            </div>
        )
    }
    
    
    if((error || !details) && !loading) return errPage;
    if(loading) return <Loader />
    return (
        <div className="w-full h-full bg-l2 p-4 mb-4">
            {/* toolbar */}
            {/* <div className="flex p-2">
                <Button text={"Messages"} cb={() => {setViewMode(ViewMode.MESSAGES)}}/>
                {/* <Button text={"Images"} cb={() => {setViewMode(ViewMode.IMAGES)}}/> */}
            {/* </div> */} 
            {/* main body */}
            <div className="w-full h-[80%] flex justify-between flex-col md:flex-row">
                {/* left div */}
                <div className="md:w-[34%] h-full p-0 lg:p-4 pt-0 flex md:flex-col gap-2 flex-col justify-center w-full md:justify-start">
                    <div className="w-full h-fit bg-d2 border-2 border-black p-2">
                        <p className="w-full text-center">Booking Details</p>
                        <div className="p-2">
                            <div className="w-full flex flex-row justify-between">
                                <p className="">Date: </p>
                                <p>{details?.booking?.start && new Date(details.booking.start).toLocaleString().split(",")[0]}</p>
                            </div>
                            <div className="w-full flex flex-row justify-between">
                                <p className="">Start: </p>
                                <p>{details?.booking?.start && new Date(details.booking.start).toLocaleString().split(",")[1]}</p>
                            </div>
                            <div className="w-full flex flex-row justify-between">
                                <p className="">End: </p>
                                <p>{details?.booking?.end && new Date(details.booking.end).toLocaleString().split(",")[1]}</p>
                            </div>
                        </div>

                    </div>

                    
                    <QuestionRenderer />


                </div>
                {/* right div */}
                <div className="w-full md:w-[65%] h-[750px] bg-d2 p-4 border-2 border-black">
                    {/* messages */}
                    <p className="w-full text-center">{viewMode}</p>
                    <div className="flex">
                        <Button text={"Messages"} cb={(e) => {
                            e.preventDefault()
                            setMessages(details.messages)
                            }}/>
                        <Button text={"Images"} cb={(e) => {
                            e.preventDefault()
                            let images = details.messages.filter((m) => {
                                if(m.type === "image") return m
                            })
                            console.log("runner")
                            setMessages(images)
                            }}/>
                    </div>
                    {<MessagesComponent />}
                    {/* {viewMode === ViewMode.IMAGES && <ImagesComponent />} */}
                </div>
            </div>
            {ImageModal === true && <ImageModal />}
        </div>
    )
}

export default Conversation;
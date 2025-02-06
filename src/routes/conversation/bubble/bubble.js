import React from "react";
import { FaTimesCircle, FaUpload, FaTrash } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../../../components/button/button";
import { authenticatedAxios } from "../../../utils/axios/axios";
import notify from "../../../utils/notifications";

export class Bubble extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: this.props.msg,
            sameSender: this.props.sameSenders,
            optionsOpen: false,
            createdAt: new Date(this.props.msg.time_created).toLocaleString(),
            refresh: this.props.refreshMessages
        }
    }

    

    componentDidMount() {

    }

    dateProcessor() {
        let options = {  
            weekday: "short", month: "short",  
            day: "numeric", hour: "2-digit", minute: "2-digit"  
        };  
        let timeOptions = {
            hour: "2-digit", minute: "2-digit"  
        };  
        if(new Date(this.state.msg.time_created).setHours(0,0,0,0) === new Date(Date.now()).setHours(0,0,0,0)) {
            return "Today at " + new Date(this.state.msg.time_created).toLocaleTimeString("en-us", timeOptions)
        } else {
            return new Date(this.state.msg.time_created).toLocaleString("en-us", options)

        }
    }

    sameSender() {
        return (<div key={this.props.currIndex} className={`w-full mt-2 mb-2 flex flex-col ${this.props.currIndex % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div 
                className={`bubble ${this.props.currIndex % 2 === 0 ? "left" : "right"} break-words text-xs sm:text-sm md:text-base w-fit ${this.state.msg.type === "image" ? "max-w-[40%]" : "max-w-[70%]"} sm:max-w-[50%]`}
                onMouseEnter={() => this.setState({optionsOpen: true})}
                onMouseLeave={() => this.setState({optionsOpen: false})}
                >
                {this.state.msg.type === "message" ? this.state.msg.content : (
                <>
                    <img className="cursor-pointer" onClick={() => {
                        console.log(this.state.msg.content)
                        window.open(this.state.msg.content, {target: "_blank"})
                    }} src={this.state.msg.content}/>
                </>
            )}
                <p className="w-full pt-2 mt-2 border-t-2 border-white flex justify-end">{this.dateProcessor()}</p>
                {this.state.optionsOpen && (
                        <div className={`w-full mt-2 mb-2 flex ${this.props.currIndex % 2 === 0 ? "justify-start" : "justify-end"} `}>
                            <div className={`min-w-[35%] flex ${this.props.currIndex % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                <FaTrash className="cursor-pointer hover:text-red-500" size={20} onClick={() => {
                                    authenticatedAxios.Delete(`/conversation/message/`, this.state.msg._id, (res) => {
                                        console.log(res)
                                        if(res.data.status === "success") {
                                            notify(2, "Message deleted")
                                            this.state.refresh(this.state.msg._id)
                                        } else {
                                            notify(4, "Error deleting message")
                                        }
                                    })
                                }}/>
                            </div>
                        </div>
                    )
                }

            </div>
        </div>)
    }

    diffSender() { 
        return (
            <div key={this.props.currIndex} className={`w-full mt-2 mb-2 flex ${this.props.user.email === this.state.msg.sender ? "justify-start" : "justify-end"}`}>
                <div className={`bubble ${this.props.user.email === this.state.msg.sender ? "left" : "right"} break-words text-xs sm:text-sm md:text-base`}>
                    {this.state.msg.content}
                </div>
            </div>
        )
    }

    render() {
        return ( <>
            {this.state.sameSender && this.sameSender()}
            {!this.state.sameSender && this.diffSender()}
        </>

        )
    }
}
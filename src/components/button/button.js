import React from "react";
import './index.css'
import { NavLink, useLinkClickHandler } from "react-router-dom";

let Button = ({text, cb, icon=null, type="button", color="bg-l2", disabled=false, extraClass={}}) => {
    let colors = ["bg-l2", "bg-d2"]
    return (
        <button type={type} 
        className={`submitBtn button flex border-2 border-d2 disabled:bg-opacity-30 disabled:border-none disabled:bg-gray-500 disabled:text-white ${color} ${color === "bg-l2" ? "text-black" : "text-l2"} ${color === "bg-l2" ? "hover:bg-d2": "hover:bg-l2"} ${color === "bg-l2" ? "hover:text-l2": "hover:text-d2"} flex-row items-center justify-center gap-2 rounded-lg p-2 m-2 w-auto ${extraClass}`} onClick={cb} disabled={disabled}>
            {icon}
            {text}
        </button>
    )
}

let ButtonColored = ({text, cb, icon=null, type="button", color="bg-l2", disabled=false, full=false}) => {
    let colors = ["bg-l2", "bg-d2"]
    return (
        <button type={type} role='button' tabIndex={0}
        className={`submitBtn button flex border-2 border-d2 disabled:bg-opacity-30 disabled:border-none disabled:bg-gray-500 disabled:text-white ${color} text-black hover:bg-d2 border-2 hover:border-black flex-row items-center justify-center gap-2 rounded-lg p-2 m-2 w-auto ${full && "w-full h-full"}`} onClick={cb} disabled={disabled}>
            {icon}
            {text}
        </button>
    )
}

let RedButton = ({text, cb, icon=null, type="button", color="bg-l2"}) => {
    let colors = ["bg-l2", "bg-d2"]
    return (
        <button type={type} 
        className={`button flex border-2 border-d2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex-row items-center justify-center gap-2 rounded-lg p-2 m-2 w-auto`} onClick={cb}>
            {icon}
            {text}
        </button>
    )
}

let NavButton = ({text, path, icon=null}) => {
    const click = useLinkClickHandler(path)
    return (
        <NavLink 
            className={`${({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              } bg-l2 text-black hover:border-2 hover:border-l2 hover:bg-d2 hover:text-l2 flex flex-row gap-2 z-10  items-center rounded-lg p-2 m-2`} 
            
            to={path}
            >
            {icon}
            {text}
        </NavLink>
    )
}



export {Button, NavButton, RedButton, ButtonColored};
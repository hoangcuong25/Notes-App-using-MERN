import React from 'react'
import {LuCheck} from "react-icon"

const Toast = ({isShown, message, type, onClose}) => {
    return (
        <div>
            <div className=''>
                <div className=''>
                    <LuCheck className="text-xl text-green-500"/>
                </div>

            </div>
        </div>
    )
}

export default Toast
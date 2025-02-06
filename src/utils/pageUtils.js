/* eslint-disable jsx-a11y/anchor-is-valid */
import { v4 as uuidv4 } from 'uuid';
import { FaQuestionCircle} from "react-icons/fa";
import { Button } from '../components/button/button';

import { Tooltip as Tp} from 'react-tooltip'

export function PageHeader ({text}) {
    return (
      <div className='w-screen flex justify-center items-center'>
        <h2>{text}</h2>
  
      </div>
    )
  }

export function Tooltip({content}) {
  let id = uuidv4()
  return (
    <div className='flex justify-end'>
      <a data-tooltip-id={id} data-tooltip-content={content}  >
        <FaQuestionCircle />
      </a>
      <Tp id={id} style={{display: "flex", flexWrap: "wrap", width: "200px", background: "black", zIndex:100}}/>
    </div>
  )
}

export let NotSubscriberComponent = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
        <div className="flex justify-center flex-col">
          <p>Please Subscribe to use the full set of features</p>
          <Button text={"Subscribe Now"} />
        </div>
      </div>
  )
}
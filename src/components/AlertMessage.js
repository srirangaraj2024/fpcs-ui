import React from 'react'

export function AlertMessage(props) {
  return props.errorMessage !==""? <div className='alert'>
    <span className='closebtn' onClick={props.onClick}>&times;</span>
  {props.errorMessage}
  </div> : null;
}

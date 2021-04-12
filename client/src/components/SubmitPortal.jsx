import React from 'react'

export default function SubmitPortal() {
  return (
    <div>
      <input type="text" name="submissionLink" />
      <button onClick={handleClick}>Submit</button>
    </div>
  )
}

import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AddClass() {

  const [codeEntered, setCodeEntered] = React.useState("");

  const { sid } = useParams();

  function handleChange(event){
    event.preventDefault();
    const val = event.target.value;
    console.log(val);
    setCodeEntered(val);
    return;
  }

  function handleClick(){
    axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:5000/addclass",
      data: {
        sid: sid,
        classCode: codeEntered
      }
    }).then((res) => {
        const loadedData = res.data;
        console.log(loadedData);
    })
  }

  return (
    <div>
      <form>
        <label htmlFor="classCode">Enter the class code.</label>
        <input type="text" name="classCode" value={codeEntered} onChange={handleChange} />
        <button onClick={(event) =>{
          event.preventDefault();
          handleClick();
          }}>Submit Code</button>
      </form>
    </div>
  )
}

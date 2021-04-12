import React from 'react';
import axios from 'axios';

export default function Register() {

  const [details, setDetails] = React.useState({
    fn: "",
    ln: "",
    sid: "",
    pw: ""
  });

  function handleSubmit(){
    axios({
      method: "POST",
      data: {
        fn: details.fn,
        ln: details.ln,
        sid: details.sid,
        password: details.pw
      },
      withCredentials: true,
      url: "http://localhost:5000/studentauth/register",
    }).then((res) => {
      console.log("hello");
    });
  }

  function handleChange(event){
    const name = event.target.name;
    const value = event.target.value;
    setDetails(function (prev) {
      const newVal = {
        ...prev,
        [name]: value
      };
      return newVal;
   });
  }
  return (
    <div>
      <form>
        <div>
          <label for="fn">First Name: </label>
          <input type="text" name="fn" value={details.fn} onChange={handleChange} />
        </div>
        <div>
          <label for="ln">Last Name: </label>
          <input type="text" name="ln" value={details.ln} onChange={handleChange} />
        </div>
        <div>
          <label for="sid">Student ID: </label>
          <input type="text" name="sid" value={details.sid} onChange={handleChange} />
        </div>
        <div>
          <label for="pw">Password: </label>
          <input type="password" name="pw" value={details.pw} onChange={handleChange} />
        </div>
        <button onClick={(event) => {
          event.preventDefault();
          handleSubmit();
          setDetails({
            fn: "",
            ln: "",
            sid: "",
            pw: ""
          });
        }}>Submit</button>
      </form>
    </div>
  )
}

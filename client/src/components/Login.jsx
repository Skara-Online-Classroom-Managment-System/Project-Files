import axios from 'axios';
import {BrowserRouter, useHistory} from 'react-router-dom';
import React from 'react';

function Login(){

  const history = useHistory();
  

  const [details, setDetails] = React.useState({
    sid: "",
    password: ""
  })

  function handleSubmit(){
    axios({
      method: "POST",
      data: {
        sid: details.sid,
        password: details.password
      },
      withCredentials: true,
      url: "http://localhost:5000/login",
    }).then((res) => {
        var queryExtender = res.data.sid;
        history.push('/user/' + queryExtender);
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
        <label for="fn">SID:</label>
        <input type="text" name="sid" value={details.sid} onChange={handleChange}/>
        <label for="password">Password</label>
        <input type="password" name="password" value={details.password} onChange={handleChange}/>
        <button onClick={(event) => {
          event.preventDefault();
          handleSubmit();
          setDetails({
            sid: "",
            password: ""
          });
          return;
        }
        }>Submit</button>
      </form>
    </div>
  );
}

export default Login;
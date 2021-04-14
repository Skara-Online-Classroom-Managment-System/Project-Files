import React from "react";
import HomeNav from "./HomeNav.jsx";

export default function Home() {
  const[name,setName]=React.useState("");

React.useEffect(()=>{
  (
    async ()=>{
        const response=await fetch("http://localhost:5000/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const content=await response.json();
        setName(content.fn);
        console.log(content);
    }
  
  )()
})


  return (
    <div>
      {/* <HomeNav name={name}/> */}
    </div>
  );
}

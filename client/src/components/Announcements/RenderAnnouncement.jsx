import React from 'react';

export default function RenderAnnouncement(props){
return(
    <div>
        <li>{props.author}</li>
        <li>{props.text}</li>
        <li>{props.time}</li>
    </div>
)
}
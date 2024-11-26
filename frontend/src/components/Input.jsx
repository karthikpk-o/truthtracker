import { useState } from "react";

export function Input(){

    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    
    const containerStyle = {
        display: "block",
        margin : "0 auto",
        padding: "10px",
        width: "300px",      
    }

    return <div>
        <textarea type ="text" placeholder="Enter something here" style={containerStyle} rows={10}
        onChange={(e)=>{
            const value = e.target.value;
            setInput(e.target.value)
        }}></textarea>
        <br></br>
        <button style={containerStyle}
        onClick={()=>{
            fetch("http://localhost:3000/search", {
                method: "POST",
                body: JSON.stringify({
                    input: input,
                }),
                headers:{
                    "Content-Type" : "application/json",
                }
            })
            .then(async function(res){
                const json = await res.json();
                setOutput(json.factcheck)
            })
        }}>Search</button>
        <br></br>
        <div className="card-container">
            <div className="card-content">
                {output}
            </div>
        </div>
    </div>
}
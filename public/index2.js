"use strict";

(function() {
    window.addEventListener("load", init);
    function init() {
      let formDataParam=new FormData;
      document.getElementById("submbutton").addEventListener("click", (event) => {
        event.preventDefault();
        formDataParam.append("dropD", document.getElementById("dropDate").value);
        getDropDData(formDataParam);
        let list = document.getElementById('demo');
        var child = list.lastElementChild; 
        while (child) {
            list.removeChild(child);
            child = list.lastElementChild;
        }
      });


  }
  async function getDropDData(formDataParam){
    try{
        let execute=await fetch("/getRabbitsWithDropD?dropD="+formDataParam.get("dropD"));
        let resp=await execute.json();
        let list = document.getElementById('demo');
        for(let index=0;index<resp.length;index++){
            let entry = document.createElement('li');
            console.log(resp[index]);
            entry.appendChild(document.createTextNode(resp[index]["Rabbit_Name"]));
            list.appendChild(entry);
        }
    }
    catch(e){
        console.log(e);
    }

  }
  async function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    } else {
      return response;
    }
  }
  async function handleError() {
    console.log("Something is wrong");
  }
})(); 
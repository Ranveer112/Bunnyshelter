"use strict";

(function() {
    window.addEventListener("load", init);
    
    function init() {
      let formDataParam=new FormData;
      document.getElementById("submbutton").addEventListener("click", (event) => {
        event.preventDefault();
        formDataParam.append("RName", document.getElementById("name").value);
        formDataParam.append("dob", document.getElementById("dob").value);
        let genderbox=document.getElementById("gender");
        formDataParam.append("sex", genderbox.options[genderbox.selectedIndex].value);
        formDataParam.append("breed", document.getElementById("breed").value);
        formDataParam.append("dropD", document.getElementById("dropOffDate").value);
        formDataParam.append("pickD", document.getElementById("pickUpDate").value);
        formDataParam.append("notes", document.getElementById("notes").value);
        formDataParam.append("carrier", document.getElementById("carrier").value);
        formDataParam.append("kibble", document.getElementById("kibble").value);
        formDataParam.append("treats", document.getElementById("treats").value);
        formDataParam.append("blankets", document.getElementById("blanket").value);
        formDataParam.append("toys", document.getElementById("toys").value);
        formDataParam.append("medic", document.getElementById("medical").value);
        formDataParam.append("needGroom", document.getElementById("nails").checked);
        let name=(document.getElementById("ownerName").value).split(" ");
        formDataParam.append("Fname", name[0]);
        let middName="";
        for(let index=1;index<name.length-1;index++){
          middName+=name[index];
        }
        formDataParam.append("Mname", middName);
        formDataParam.append("LName", name[name.length-1]);
        formDataParam.append("email", document.getElementById("ownerEmail").value);
        formDataParam.append("street", document.getElementById("streetAddresss").value);
        formDataParam.append("city", document.getElementById("city").value);
        formDataParam.append("state", document.getElementById("state").value);
        formDataParam.append("zip", document.getElementById("zip").value);
        formDataParam.append("Vname", document.getElementById("vet").value);
        formDataParam.append("VPhone", document.getElementById("vetPhone").value);
        formDataParam.append("rStat", "BOARDER");
        formDataParam.append("emergencyC", document.getElementById("emergencyContactName").value+" "+document.getElementById("emergencyContactPhone").value+" "+document.getElementById("emergencyContactRelationship").value);
        let listItems=document.getElementById("exampleRecipientInput").children;
        for(let index=0;index<listItems.length;index++){
          formDataParam.append(listItems[index].value, listItems[index].selected?document.getElementById("phone").value:'');
        }
        formDataParam.append("hasFood", "");
        formDataParam.append("likedStuff", "");
        updateAllHelper(formDataParam);
      });


  }
  async function updateAllHelper(formDataParam){
    let execute=await fetch("/UpdateTable", {method: "POST", body: formDataParam});

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
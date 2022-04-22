// let urladdress = "https://creatorapp.zoho.in/api/v2/demoproject/studentcms/report/StudentRecord_Report";
// let header = {'Authorization': 'Zoho-oauthtoken 1000.1c68905a87b5c56786cd4dc92d75b900.69b5d7af1df0eed67cb2438f84444d68'}


let INIT =  ZOHO.CREATOR.init();
let API = ZOHO.CREATOR.API;
let formName = '';
let reportName = 'StudentRecord_Report';

let modal = document.querySelector(".zmodal");

document.querySelector(".zclose").onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
    document.querySelector(".zmodal").style.display = "none";
    }
}

function createForm(data='',text){
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov","Dec"];

    if(data==''){                
        data = {Student_ID:'',firstName:'', lastName:'', birthdate:'', grade:'', mentor:''};
    }else{                
        let date =  new Date(data.birthdate);
        month = date.getMonth()+1;
        month =  (month>10)?month:("0"+month);                
        data['birthdate'] = date.getFullYear()+"-"+month+"-"+date.getDate();
    }

    let form = `<form id="dataForm">
        <input type="text" name="Student_ID" class="form-control" value="`+data.Student_ID+`" placeholder="Student ID" /><br/>
        <input type="text" name="firstName" class="form-control" value="`+data.firstName+`" placeholder="First Name" /><br/>
        <input type="text" name="lastName" class="form-control" value="`+data.lastName+`" placeholder="Last Name" /><br/>
        <input type="date" name="birthdate" class="form-control"  value="`+data.birthdate+`" placeholder="Birth Date" /><br/>
        <input type="text" name="grade" class="form-control" value="`+data.grade+`" placeholder="Grade" /><br/>        
        <input type="text" name="mentor" class="form-control" value="`+data.mentor+`" placeholder="Mentor" /><br/>        
        <input type="submit" value="`+text+`" /><input type="reset" />
    </form><br/>`;
    document.querySelector(".zmodal-header").innerHTML = "<h3>"+text+" Record</h3>";
    document.querySelector(".zmodal-body").innerHTML =  form;

    $("#dataForm").on("submit",function(e){
        e.preventDefault();        

        let formData = $(this).serializeArray();
        let record = {};	
          formData.forEach(item => {
              record[item.name] = item.value;
          });
                  
        let date = new Date(record.birthdate);        

        month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov","Dec"];

        record['birthdate'] = date.getDate()+"-"+month[date.getMonth()]+"-"+date.getFullYear();
                
        action = text.toLowerCase();
        
        if(action === 'add'){                        
            config = { formName: "StudentRecord", data:{    data:record } };
            console.log(config)
            addRecord(config);            
        }else if(action === 'update'){                            
            config = { reportName:'StudentRecord_Report', id:data.ID, data:{    data:record } };
            console.log(config)
            updateRecord(config);
        }
        
    });
}

function getAllRecord(){    
    INIT.then(function() {               
        API.getAllRecords({ reportName:"StudentRecord_Report" }).then(function(response){              
            if(response.code == 3000 ){
                data = response.data;                
                let rows = '';
    
                if(data.length == 0){
                    document.querySelector("#dataRecord").innerHTML = "No. Record Available!";        
                }else{
                    data.map((item) => {                
                        rows += `<div class="card">
                                    <div class="card-body">          
                                        <div class="d-flex justify-content-between">
                                            <p><strong>Name:</strong> `+item.firstName+` `+item.lastName+`</p>
                                            <p><strong>Student ID:</strong> `+item.Student_ID+`</p>            
                                        </div>
                                        <p><strong>Date of Birth:</strong> `+item.birthdate+`</p>            
                                        <div class="d-flex justify-content-between">
                                            <p><strong>Grade:</strong> `+item.grade+`</p>
                                            <p><strong>Mentor:</strong> `+item.mentor+`</p>            
                                        </div>
                                        <div class="d-flex justify-content-end">
                                            <a herf="javascript:void(0)" class="btn btn-outline-primary" onclick="getButton('update','`+item.ID+`')"> Update</a>
                                            <a herf="javascript:void(0)" class="btn btn-outline-danger" onclick="getButton('delete','`+item.ID+`')"> Delete</a>
                                        </div>
                                    </div>
                                </div>`;
                            });
                    document.querySelector("#dataRecord").innerHTML = rows;
                }
            }           
        });
    });
}

$(document).ready(function(){
    getAllRecord();
});

// Get Data From Specific ID
function getRecordById(config){    
    INIT.then(function(){        
        API.getRecordById(config).then(function(response){
            return data = response.data;
        });
    });    
}

// Add Records
function addRecord(config={}){
    if(config.hasOwnProperty('envUrlFragment')){
        delete config.envUrlFragment;
    }
    if(config.hasOwnProperty('scope')){
        delete config.scope;
    }

    //console.log(config);        
    API.addRecord(config).then(function(response){        
        if(response.code == 3000){            
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Record added successfully</h3>";
            getAllRecord();
        }else{
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Something Went Wrong!</h3>";
        }       
    });
}

// Update Record
function updateRecord(config={}){         
    if(config.hasOwnProperty('envUrlFragment')){
        delete config.envUrlFragment;
    }
    if(config.hasOwnProperty('scope')){
        delete config.scope;
    }
    
    //console.log(config);
    
        API.updateRecord(config).then(function(response){
            if(response.code == 3000){                            
                alert("Record updated successfully");                             
                getAllRecord();
            }else{
                alert("Error! In Record deletion");
            }
        });        
    
}


// Delete Records
function deleteRecord(config){    
    INIT.then(function(){        
        API.deleteRecord(config).then(function(response){            
            if(response.code == 3000){                            
                getAllRecord();
            }else{
                alert("Error! In Record deleted!");
            }
        });
    });    
}


function getButton(text,id=''){    
    document.querySelector(".zmodal-footer").innerHTML = "";
    text = text.toLowerCase();
    if(text == 'add'){
        createForm('','Add');
        modal.style.display = "block";
    }else if(text == 'update'){

        let data = '';
        INIT.then(function(){        
            API.getRecordById({ reportName: "StudentRecord_Report", id: id }).then(function(response){
                data = response.data;                
            }).then(function(){
                createForm(data,'Update');
            }).then(function(){
                modal.style.display = "block";
            });
        });
                
    }else if(text == 'delete'){                 
        deleteRecord({ reportName: 'StudentRecord_Report', criteria: "ID == "+id });               
    }
}
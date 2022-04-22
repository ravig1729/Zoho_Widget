let api = ZOHO.CREATOR.API;

function getAllRecord(){
    ZOHO.CREATOR.API.getAllRecords({ reportName:"StudentRecord_Report" }).then(function(response){              
        if(response.code == 3000 ){
        var recordArr = response.data;
        let rows = '';
        recordArr.map((item) => {
            
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
        }else{
            document.querySelector("#dataRecord").innerHTML = "There's no Record Available";
        }              
    });
}

getAllRecord();

function getAction(record ='', action = ''){
        
    if(action === 'add'){
        config = { formName: "StudentRecord", data:record}
        addRecord(api, config);
    }else if(action === 'update'){
        config["id"] = record.id;
        delete record.id;
        config["data"] = record;
        updateRecord(api, config);
    }
}


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
    if(data==''){
        data = {Student_ID:'',firstName:'', lastName:'', birthdate:'', grade:'', mentor:''};
    }

    let form = `<form  method="POST" id="dataForm">
        <input type="text" name="studentId" class="form-control" value="`+data.Student_ID+`" placeholder="Student ID" /><br/>
        <input type="text" name="fname" class="form-control" value="`+data.firstName+`" placeholder="First Name" /><br/>
        <input type="text" name="lname" class="form-control" value="`+data.lastName+`" placeholder="Last Name" /><br/>
        <input type="date" name="birthdate" class="form-control"  value="`+data.birthdate+`" placeholder="Birth Date" /><br/>
        <input type="text" name="grade" class="form-control" value="`+data.grade+`" placeholder="Grade" /><br/>        
        <input type="text" name="mentor" class="form-control" value="`+data.mentor+`" placeholder="Mentor" /><br/>        
        <input type="submit" value="`+text+`" /><input type="reset" />
    </form><br/>`;
    document.querySelector(".zmodal-header").innerHTML = "<h3>"+text+" Record</h3>";
    document.querySelector(".zmodal-body").innerHTML =  form;

    $("#dataForm").on("submit",function(e){
        e.preventDefault();
        
        record = $(this).serialize();        
        action = text.toLowerCase();

        if(action === 'add'){            
            addRecord(api, { formName: "StudentRecord", data: record });
        }else if(action === 'update'){
            id = record.id;
            delete record.id;
            updateRecord(api, { reportName:'StudentRecord', id:id, data:record });
        }
        
    });
}


function getRecordById(api,config){
    let data='';
    api.getRecordById(config).then(function(response){
        data = response.data;
    });
    return data;
}

function deleteRecord(api,config){    
    api.deleteRecord(config).then(function(response){
        if(response.code == 3000){            
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Record has been deleted</h3>";
        }else{            
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Something Went Wrong!</h3>";
        }
    });
}

function updateRecord(api,config){
    api.updateRecord(config).then(function(response){
        if(response.code == 3000){            
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Record updated successfully</h3>";
            
        }else{
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Something Went Wrong!</h3>";
        }
        getAllRecord();
    });
}

function addRecord(api,config){
    api.addRecord(config).then(function(response){        
        if(response.code == 3000){            
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Record added successfully</h3>";
        }else{
            document.querySelector(".zmodal-footer").innerHTML = "<h3>Something Went Wrong!</h3>";
        }
        getAllRecord();
    });
}

function getButton(text,id=''){

    if(text == 'add'){
        createForm('','Add');
        modal.style.display = "block";
    }else if(text == 'update'){

        config = { reportName: "StudentRecord_Report", id: id };                         
        let data = '';
        ZOHO.CREATOR.init().then(function() {            
            data = getRecordById(api,config);
        }).then(function(){
            createForm(data,'Update');
        }).then(function(){
            modal.style.display = "block";
        });
                
    }else if(text == 'delete'){         

        config = { reportName: "StudentRecord_Report", criteria: "ID == '"+id+"'" };      
        deleteRecord(api,config);               
    }

}
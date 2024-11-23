function el(target) { return document.querySelector(target); }

let pre = `http://localhost:5200`; 
pre = `https://office.boxcar.site`;

let customerRoot = el('#customerRoot');

// customer card 
async function fetchAllCustomers() {
    customerRoot.innerHTML = loader('primary', 'Fetching records now.')
    let url =`${pre}/records`;
    try {
        let response = await fetch(url);
        try {
            let data = await response.json()
            customerRoot.innerHTML = htmlFetchAllCustomer(data);

        } catch (parseError) {
            customerRoot.innerHTML = alertMessage('warning', parseError)
        }
    } catch (networkError) {
        customerRoot.innerHTML = alertMessage('warning', networkError)      
    }
}

function htmlFetchAllCustomer(data){

    let html = `<div class="list-group">`;

    // chip 
    data.forEach(d => {
        html += `
        <div class="chip shadow " id="chip${d.custId}">
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">

                    <h5 class="mb-1"> 
                    <span class="badge bg-green me-1">
                         ${d.jobs.length}
                    </span> ${d.fname} 
                    <span class="lname h5" id=${d.custId}>
                        ${d.lname}
                    </span>
                    </h5>

                    <small class="text-secondary">${d.date}</small>
                </div>

                <p class="m-0">${d.address} - ${d.city}</p>
                <small class="text-secondary">${d.city}, ${d.state} ${d.zip}</small> <br>        
                <div class="d-flex justify-content-end">                         
                    ${customerBtn(d.custId)} 
                    ${jobBtn(d.custId)}
                </div>

           
            </a> 
            <div class="job-chip" id="jobChip${d.custId}">

            `
 
    if (d.jobs.length == 0) { html += '<br>' + alertMessage('primary', 'No job records..') }
    let jobs = d.jobs;
    jobs.forEach(job => {
        if (job) { html += jobCard(job)}

    })

    html += `
            </div>
        </div>    
    `
    })

    html += `</div>`;
    html += modal('Customer Contact');
    html += modalAddCustomer('Add Customer');
    return html;

}

// job cards within customer card
function jobCard(data){
    let count = 0;
    let html = `
    
    <div id="jobCard${data.jobId}" class="job-card card mx-auto rounded-0" style="block">
        <div class="card-body">

            <div id="jobId${data.jobId}" class="job-card-id">${data.jobId}</div>
            <div id="stat${data.jobId}" class="job-card-stat">${data.status}</div>

            <h5 class="card-title">${data.jName}
            <span class="float-end">${data.jDate}</span></h5>
            <p class="card-text m-0 p-0">Phone: ${data.jPhone}</p>
            <p class="card-text m-0 p-0">${data.jAddress} - ${data.jCity}</p>
            <p class="card-text m-0 p-0" id="status${data.jobId}">${getIcon(data.status)}${data.status}</p>
            <a href="${data.jImg || ''}">Img</a>
            <a href="${data.jScope || ''}  ">Scope</a>
        </div>
        </div>
    `;
    
    return html;
}
function handleJobsBtnClick(custId){
    let jobChipElem = document.getElementById(`jobChip${custId}`);

    if (jobChipElem.style.display == 'block') {
            jobChipElem.style.display = 'none';
            document.getElementById(`spanJobBtn${custId}`).innerHTML = 'Jobs';
            document.getElementById(`imgJobBtn${custId}`).src = "public/assets/icons/leaderboard-green.png";

        } else {
            jobChipElem.style.display = 'block';
            jobChipElem.scrollIntoView();
            document.getElementById(`chip${custId}`).scrollIntoView();
            document.querySelector('.navbar').scrollIntoView()
            document.getElementById(`imgJobBtn${custId}`).src = "public/assets/icons/close-blue.png";
            document.getElementById(`spanJobBtn${custId}`).innerHTML = 'Close';
            
    }
}


// job card  
async function fetchAllJobs() {
    customerRoot.innerHTML = loader('primary', 'Fetching jobs now.')
    let url =`${pre}/jobs`;
    try {
        let response = await fetch(url);
        try {
            let data = await response.json()
            customerRoot.innerHTML = htmlFetchAllJobs(data);

        } catch (parseError) {
            customerRoot.innerHTML = alertMessage('warning', parseError)
        }
    } catch (networkError) {
        customerRoot.innerHTML = alertMessage('warning', networkError)      
    }
}
function htmlFetchAllJobs(data){

    let html = `<div class="list-group">`;

    // chip 
    data.forEach(d => {
        html += `
        <div class="chip shadow " id="chip${d.jobId}">
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between align-items-center">

                    <div class="d-flex align-items-center"> 
                        <small class="badge bg-${getStatus(d.status).bg} text-${getStatus(d.status).text} me-1" style="height:23px;">
                            ${d.status}
                        </small> 
                        <p class="h6 m-0 p-0 ms-2 pt-1">${d.jName} </p>
                    </div>
                    
                    <small class="text-secondary">${d.jDate}</small>
                    


                </div>

                <p class="m-0 pt-1">Phone: ${d.jPhone || 'n/a'}</p>
                <p class="m-0">${d.jAddress}</p>
                
                <small class="text-secondary">${d.jCity}, ${d.jState} ${d.jZip}
                   <span class="float-end"> ${customerBtn(d.custId)} <span class="mb-2">${getStatus(d.status).img}</span></span>
                </small> <br>     
            
            <div class="p-1"></div>

           
            </a> 
        </div>    
    `
    })

    html += `</div>`;
    html += modal('Customer Contact');
    html += modalAddCustomer('Add Customer');
    return html;

}





// customer profile modal
function modal(title){
    return `
        <div class="modal fade" id="customerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen mx-auto" style="max-width:44rem;">
            <div class="modal-content rounded-0 ">
            <div class="modal-header bg-dark rounded-0 text-white">
                <h1 class="modal-title fs-5" id="customerModalLabel">${title}</h1>
                <button type="button" class="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
                <div class="modal-body" id="customerModalBody">
                    ${loader('primary', 'Loading contact info')}
                </div>
            </div>
        </div>
        </div>
    `;
}
function fetchCustomerModal(target){
    let t = document.getElementById(target);
    let html = `
    
    <div id="customerForm" class="m-0 p-0 mt-2">
       <div class="add-customer col-12 mx-auto bm-page">

           <form action="" method="POST" id="addCustomer">           
   
                <div class="row">
                    <div class="col-2"><label for="fname" class="form-label">First:</label></div>
                    <div class="col-10">  <input type="text" class="form-control" id="fname" name="fname" required></div>          
                </div>
           
                <div class="row">
                    <div class="col-2"><label for="lname" class="form-label">Last:</label></div>
                    <div class="col-10"><input type="text" class="form-control" id="lname" name="lname" required></div>                        
                </div>
   
                <div class="row">
                    <div class="col-2"><label for="date" class="form-label">Date:</label></div>
                    <div class="col-10"> <input type="date" class="form-control" id="date" required name="date"></div>     
                </div>

                <div class="row">
                    <div class="col-2"><label for="custId" hidden class="form-label">CustId:</label></div>
                    <div class="col-10"> <input type="text" hidden class="form-control" id="custId" name="custId" disabled></div>
                </div>
   
             
   
                <div class="row">
                    <div class="col-2"><label for="phone" class="form-label">Phone:</label></div>
                    <div class="col-10"> <input type="tel" class="form-control" id="phone" required placeholder="Format: 123-456-7890" 
                                        name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"> </div>
                </div>
                       
   
                <div class="row">
                    <div class="col-2"><label for="cell" class="form-label">Cell:</label></div>
                    <div class="col-10"><input type="tel" class="form-control" id="cell" placeholder="Format: 123-456-7890" 
                            name="cell" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"></div>
                </div>
   

                <div class="row">
                    <div class="col-2"><label for="address" class="form-label">Address:</label></div>
                    <div class="col-10"><input type="text" class="form-control" id="address" required name="address"></div>
                </div>

                <div class="row">
                    <div class="col-2"><label for="email" class="form-label">Email:</label></div>
                    <div class="col-10"><input type="email" class="form-control" id="email" name="email"></div>         
                </div>
                             
                <div class="row">
                    <div class="col-2"><label for="city" class="form-label">City:</label></div>
                    <div class="col-10"> <input type="text" class="form-control" id="city" name="city"></div>
                </div>
   
                <div class="row">
                    <div class="col-2"><label for="state" class="form-label">State:</label></div>
                    <div class="col-10"><input type="text" class="form-control" id="state" name="state"></div>  
                </div>   
                   
                <div class="row">
                    <div class="col-2"> <label for="zip" class="form-label">Zip:</label></div>
                    <div class="col-10"> <input type="text" class="form-control" id="zip"  name="zip"></div>   
                </div>        
            
   
                <div class="row">
                    <div class="col-2"><label for="notes" class="form-label">Notes:</label></div>
                    <div class="col-10"><textarea type="text" class="form-control" id="notes" placeholder="Notes" name="notes" rows="8"></textarea></div> 
                </div>

                <div class="row">
                    <div class="col-2"> <label for="img" class="form-label">Img:</label></div>
                    <div class="col-10"> <input type="img" class="form-control" id="img"  name="img"></div>    
                </div>
              
                <div class="form-footer d-flex justify-content-end mt-2">
                   <button type="button" class="btn btn-danger me-1" data-bs-dismiss="modal">Close</button>
                   <button type="button" onclick="handleUpdateCustomerRecord()" data-bs-dismiss="modal" class="btn btn-success">Save</button>
                </div>
   
         </form>
   
       </div>
   </div>   


    `;
    t.innerHTML = html;
}
function handleAddCustomer() {

    let url = `${pre}/add-customer`;

    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let state = document.getElementById('state').value;
    let zip = document.getElementById('zip').value;
    let date = document.getElementById('date').value;
    let notes = document.getElementById('notes').value;
    let phone = document.getElementById('phone').value;
    let cell = document.getElementById('cell').value;
    let email = document.getElementById('email').value;
    let custId = '';

    if (fname == '' || lname == '' || address == '' || city == '' || state == '' || date == '' || phone == '') { alert('Enter job details'); return;}

    let params = `fname=${fname}&&lname=${lname}&&address=${address}&&city=${city}&&state=${state}&&zip=${zip}&&date=${date}
                    &&notes=${notes}&&phone=${phone}&&custId=${custId}&&cell=${cell}&&email=${email}`;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {
                customerRoot.innerHTML = `${alertMessage('primary', 'Successfully added contact!')}`
                fetchAllCustomers();         
            }
      };
      
      xmlhttp.open("POST", url, true);
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xmlhttp.send(params);


}


// add customer functions 
function modalAddCustomer(title){


    return `
        <div class="modal fade" id="addCustomerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen mx-auto" style="max-width:44rem;" >
            <div class="modal-content rounded-0 ">

            <div class="modal-header bg-dark rounded-0 text-white">
                <h1 class="modal-title fs-5" id="customerModalLabel">${title}</h1>
                <button type="button" class="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

                <div class="modal-body" id="addCustomerModalBody" >
                 
    
                <div id="customerForm" class="m-0 p-0">
                <div class="add-customer col-12 mx-auto bm-page">

                <form action="http://localhost:5200/add-customer" method="POST" id="addCustomer">
                
                            
                        
                <div class="row">
                    <div class="col-2"><label for="fname" class="form-label">First:</label></div>
                    <div class="col-10">  <input type="text" class="form-control" id="fname" name="fname" required></div>          
                </div>
           
                <div class="row">
                    <div class="col-2"><label for="lname" class="form-label">Last:</label></div>
                    <div class="col-10"><input type="text" class="form-control" id="lname" name="lname" required></div>                        
                </div>
   
                <div class="row">
                    <div class="col-2"><label for="date" class="form-label">Date:</label></div>
                    <div class="col-10"> <input value=${getCurrentTime()} type="text" class="form-control" id="date" required name="date"></div>     
                </div>

                <div class="row">
                    <div class="col-2"><label for="custId" hidden class="form-label">CustId:</label></div>
                    <div class="col-10"> <input type="text" hidden class="form-control" id="custId" name="custId" disabled></div>
                </div>
   
             
   
                <div class="row">
                    <div class="col-2"><label for="phone" class="form-label">Phone:</label></div>
                    <div class="col-10"> <input type="tel" class="form-control" id="phone" required name="phone"> </div>
                </div>
                       
   
                <div class="row">
                    <div class="col-2"><label for="cell" class="form-label">Cell:</label></div>
                    <div class="col-10"><input type="tel" class="form-control" id="cell" placeholder="Format: 123-456-7890" name="cell"></div>
                </div>
   

                <div class="row">
                    <div class="col-2"><label for="address" class="form-label">Address:</label></div>
                    <div class="col-10"><input type="text" class="form-control" id="address" required name="address"></div>
                </div>

                <div class="row">
                    <div class="col-2"><label for="email" class="form-label">Email:</label></div>
                    <div class="col-10"><input type="email" class="form-control" id="email" name="email"></div>         
                </div>
                             
                <div class="row">
                    <div class="col-2"><label for="city" class="form-label">City:</label></div>
                    <div class="col-10"> <input type="text" class="form-control" id="city" name="city"></div>
                </div>
   
                <div class="row">
                    <div class="col-2"><label for="state" class="form-label">State:</label></div>
                    <div class="col-10"><input type="text" class="form-control" id="state" name="state"></div>  
                </div>   
                   
                <div class="row">
                    <div class="col-2"> <label for="zip" class="form-label">Zip:</label></div>
                    <div class="col-10"> <input type="text" class="form-control" id="zip"  name="zip"></div>   
                </div>        
            
   
                <div class="row">
                    <div class="col-2"><label for="notes" class="form-label">Notes:</label></div>
                    <div class="col-10"><textarea type="text" class="form-control" id="notes" name="notes" rows="8"></textarea></div> 
                </div>

                <div class="row">
                    <div class="col-2"> <label for="img" class="form-label">Img:</label></div>
                    <div class="col-10"> <input type="img" class="form-control" id="img"  name="img"></div>    
                </div>


               <div class="form-footer d-flex justify-content-end mt-2">
                   <button type="button" class="btn btn-danger me-1" data-bs-dismiss="modal">Close</button>
                   <button type="button" class="btn btn-secondary me-1" onclick="clearCustomerForm()">Clear</button>
                   <button type="button" onclick="handleAddCustomer()" data-bs-dismiss="modal" class="btn btn-success">Submit</button>
               </div>
   
         </form>
   
       </div>
   </div>   


         
                </div>
            </div>
        </div>
        </div>
    `;
}
async function populateCustomerModal(custId) {
    
    let url = `${pre}/customers/${custId}`
    try {
        let response = await fetch(url);
        try {
            let data = await response.json()
            handlePopulateCustomerModal(data);
        } catch (parseError) {
            alertMessage('warning', parseError)
        }
    } catch (networkError) {
        alertMessage('warning', networkError)
    }
}
function handlePopulateCustomerModal(data) {
    el('#fname').value = data[0].fname;
    el('#lname').value = data[0].lname;
    el('#address').value = data[0].address;
    el('#city').value = data[0].city;
    el('#state').value = data[0].state;
    el('#zip').value = data[0].zip;
    el('#phone').value = data[0].phone;
    el('#cell').value = data[0].cell;
    el('#notes').value = data[0].notes;
    el('#email').value = data[0].email;
    el('#custId').value = data[0].custId;
    el('#date').value = data[0].date;
    el('#img').value = data[0].img;
}
function handleUpdateCustomerRecord() {


    let custId = document.getElementById('custId').value;
    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let address = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let state = document.getElementById('state').value;
    let zip = document.getElementById('zip').value;   
    let phone = document.getElementById('phone').value;
    let cell = document.getElementById('cell').value;
    let email = document.getElementById('email').value;
    let notes = document.getElementById('notes').value
    let date = document.getElementById('date').value;
    let img = document.getElementById('img').value;
  
    let url = `${pre}/update-customer`;
    let params = `custId=${custId}&&fname=${fname}&&lname=${lname}&&address=${address}&&city=${city}&&state=${state}&&zip=${zip}&&phone=${phone}&&cell=${cell}&&email=${email}&&notes=${notes}&&date=${date}&&img=${img}`;
    
    customerRoot.innerHTML = ` ${loader('primary')} ${alertMessage('info', 'Updating record')}`;
                                
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            customerRoot.innerHTML = `${alertMessage('info', 'Updated contact!')}`;
            fetchAllCustomers();
        } else {
            customerRoot.innerHTML = alertMessage('danger', 'Error updating, please try again!')
        }
      };
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(params);

                        

}


// utilities
function getStatus(status) {
 
    if (status == 'Scheduled') {
        return {'bg': 'red',
                'text' : 'light',
                'img' : '<img class="" src="https://office.boxcar.site/public/assets/icons/schedule-r.png" alt="" width="25">'
                };
    }
    if (status == 'Ordered') {
        return {'bg': 'purple',
                'text' : 'light',
                'img' : '<img class="" src="https://office.boxcar.site/public/assets/icons/order-p.png" alt="" width="25">'
                };
    }
    if (status == 'In-Progress') {
        return {'bg': 'blue',
                'text' : 'light',
                'img' : '<img class="" src="https://office.boxcar.site/public/assets/icons/in-progress-b.png" alt="" width="25">'
                };
    }
    if (status == 'Estimate') {
        return {'bg': 'pink',
                'text' : 'light',
                'img' : '<img class="" src="https://office.boxcar.site/public/assets/icons/contract-pink.png" alt="" width="25">'
                };
    }
    if (status == 'Completed') {
        return {'bg': 'success',
            'text' : 'light',
            'img' : '<img class="" src="https://office.boxcar.site/public/assets/icons/done-green.png" alt="" width="25">'
            };
    } else {
        return {'bg': 'info',
                'text' : 'dark',
                'img' : '<img class="" src="https://office.boxcar.site/public/assets/icons/error-red.png" alt="" width="25">'
                };
    }

}
function getCurrentTime(){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${month}-${day}-${year}`;
    return currentDate
}
function jobBtn(custId){
    return ` <button onclick="handleJobsBtnClick(this.id)" id="${custId}" class="btn ms-2 text-black" type="button" 
                     data-bs-toggle="modal" data-bs-target="#allJobsModal">
                <img id="imgJobBtn${custId}" class="pb-1" src="public/assets/icons/leaderboard-green.png" alt="" width="25">
                    <span id="spanJobBtn${custId}" >Jobs<span>
            </button>`;
}
function customerBtn(custId){
    return ` <button onclick="fetchCustomerModal('customerModalBody'), populateCustomerModal(${custId})" id="${custId}" class="btn ms-2 text-black" type="button"
                data-bs-toggle="modal" data-bs-target="#customerModal">
                <img class="pb-1" src="public/assets/icons/contact-green.png" alt="" width="25">
                    Profile
            </button>`;
}
function loader(type, message){
    return `  
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-${type}" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <h4 class="text-${type} ms-3">${message}</h4>
    </div> 
    `;
}
function alertMessage(type, message) {
    return `
 
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>   
    
    
    `;
}
function clearCustomerForm() {
    el('#fname').value = '';
    el('#lname').value = '';
    el('#address').value = '';
    el('#city').value = '';
    el('#state').value = '';
    el('#zip').value = '';
    el('#phone').value = '';
    el('#cell').value = '';
    el('#notes').value = '';
    el('#email').value = '';
    el('#custId').value = '';
}
function getIcon(status){

    if (status == 'Scheduled') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/schedule-r.png" alt="" width="32">';
    }
    if (status == 'Ordered') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/order-p.png" alt="" width="32">';
    }
    if (status == 'In-Progress') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/in-progress-b.png" alt="" width="32">';
    }
    if (status == 'Estimate') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/contract-pink.png" alt="" width="32">';
    }
    if (status == 'Completed') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/done-green.png" alt="" width="32">';
    } else {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/error-red.png" alt="" width="32">';
    }


}


//startup
document.addEventListener("DOMContentLoaded", fetchAllCustomers())
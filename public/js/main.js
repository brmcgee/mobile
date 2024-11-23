function el(target) {
    return document.querySelector(target);
}

let pre = `http://localhost:5200`; 
pre = `https://office.boxcar.site`;

let customerRoot = el('#customerRoot');



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

function customerTemplate(customers) {
    let html = '';
    html += `

        <div class=" col-12 col-md-11 mx-auto  bm-page">

            <div class="bm-header-primary">
                <h5 class="">Customer lists<span class="float-end pe-3 badge bg-light text-primary"> Total: ${customers.length}</span></h5>
            </div>
            
            <table class="table table-stripe ">
                <thead class="thead">
                    <tr>
                        <th scope="col">Job</th>
                        <th scope="col">Add</th>
                        <th scope="col">Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Phone</th>
                    </tr>
                </thead>
                <tbody>`;
        
            customers.forEach(c => {
                html += customerTemplateInner(c);
            });


    html += `  </tbody>
            </table>`;

    return html;
}

function customerTemplateInner(customer) {
    let html = '';
    html += `
                <tr>
                    <th scope="row">

                        <button id="${customer.custId}" class="bg-transparent border-0" type="button" onclick="getJobsByCustomers(this.id)">
                            <img class="pb-1" src="https://office.boxcar.site/public/assets/icons/folder-open-red.png" alt="open" width="24">
                        </button>
                    </td>

                    <td id="">
                        <button id="${customer.custId}" class="bg-transparent border-0" type="button" onclick="addJob(this.id)">
                            <img class="pb-1" src="https://office.boxcar.site/public/assets/icons/add-doc-blue.png" alt="add" width="23">
                        </button>
                    </td> 

                    <td>    
                        <a href="#" type="button" onclick="fetchCustomerRecord(${customer.custId})" 
                                class="text-decoration-none text-dark fw-semibold cursor-pointer ">
                            <span class="bm-text-primary bm-hover">${customer.lname}, ${customer.fname}</span><br>
                        </a>
                    </td>  

                    <td>${customer.address} ${customer.city}, ${customer.state.toUpperCase()}</td>

                    <td>${customer.phone} </td>                   
                </tr> 
            </div>  
            `;
            
    return html;
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
    return html;

}

function jobCard(data){
    let html = `
    
    <div class="job-card card mx-auto rounded-0">
        <div class="card-body ">
            <h5 class="card-title">${data.jName}
            <span class="float-end">${data.jDate}</span></h5>
            <p class="card-text m-0 p-0">Phone: ${data.jPhone}</p>
            <p class="card-text m-0 p-0">${data.jAddress} - ${data.jCity}</p>
            <p class="card-text m-0 p-0">${getIcon(data.status)}${data.status}</p>
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
            document.getElementById(`imgJobBtn${custId}`).src = "public/assets/icons/close-blue.png";
            document.getElementById(`spanJobBtn${custId}`).innerHTML = 'Close';
            
    }
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
function modal(title){
    return `
        <div class="modal fade" id="customerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable ">
            <div class="modal-content rounded-0 ">
            <div class="modal-header bm-bg-header rounded-0 text-white">
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
    
    <div id="addCustomerForm" class="m-0 p-0">
       <div class="add-customer col-12 mx-auto bm-page">

           <form action="http://localhost:5200/add-customer" method="POST" id="addCustomer">
   
               <div class="row pb-2 pt-3">
   
                   <div class="col-sm-12 col-md-3">
                       <label for="fname" class="form-label">First:</label>
                       <input type="text" class="form-control" id="fname" name="fname" required>
                   </div>
           
                   <div class="col-sm-12 col-md-3">
                       <label for="lname" class="form-label">Last:</label>
                       <input type="text" class="form-control" id="lname" name="lname" required>
                   </div>
   
                   <div class="col-sm-8 col-md-4">
                       <label for="date" class="form-label">Date:</label>
                       <input type="date" class="form-control" id="date" required name="date">
                   </div>

                   <div class="col-sm-4 col-md-2">
                       <label for="custId" hidden class="form-label">CustId:</label>
                       <input type="text" hidden class="form-control" id="custId" value=""  name="custId" disabled>
                   </div>
   
               </div>
   
               <div class="row pb-2">
   
                   <div class="col-12 col-sm-6">
                       <label for="phone" class="form-label">Phone:</label>
                       <input type="tel" class="form-control" id="phone" required placeholder="Format: 123-456-7890" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
                   </div>
   
                   <div class="col-12 col-sm-6">
                       <label for="cell" class="form-label">Cell:</label>
                       <input type="tel" class="form-control" id="cell" placeholder="Format: 123-456-7890" name="cell" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
                   </div>
   
   
               </div>
   
               <div class="row pb-2">

                   <div class="col-sm-12 col-md-6">
                       <label for="address" class="form-label">Address:</label>
                       <input type="text" class="form-control" id="address" required name="address">
                   </div>

                   <div class="col-sm-12 col-md-6">
                       <label for="email" class="form-label">Email:</label>
                       <input type="email" class="form-control" id="email" name="email">
                   </div>
      
               </div>    
               
               <div class="row pb-2">
                   <div class="col-sm-12 col-md-6">
                       <label for="city" class="form-label">City:</label>
                       <input type="text" class="form-control" id="city" name="city">
                   </div>
   
                   <div class="col-sm-6 col-md-3">
                       <label for="state" class="form-label">State:</label>
                       <input type="text" class="form-control" id="state" name="state">
                   </div>   
                   
                   <div class="col-sm-6 col-md-3">
                       <label for="zip" class="form-label">Zip:</label>
                       <input type="text" class="form-control" id="zip"  name="zip">
                   </div>        
               </div>
   
               <div class="row pb-2">
                   <div class="col-sm-12">
                       <label for="notes" class="form-label">Notes:</label>
                       <textarea type="text" class="form-control" id="notes" placeholder="Notes" name="notes" rows="13"></textarea>
                   </div>
   
   
               </div>
               <div class="form-footer d-flex justify-content-end">
                   <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                   <button type="button" class="btn btn-secondary me-1" onclick="clearCustomerForm()">Clear</button>
                   <button type="button" onclick="handleAddCustomer()" class="btn btn-primary">Submit</button>
               </div>
   
         </form>
   
       </div>
   </div>   


    `;
    t.innerHTML = html;
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
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/schedule-r.png" alt="" width="25">';
    }
    if (status == 'Ordered') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/order-p.png" alt="" width="25">';
    }
    if (status == 'In-Progress') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/in-progress-b.png" alt="" width="25">';
    }
    if (status == 'Estimate') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/contract-pink.png" alt="" width="25">';
    }
    if (status == 'Completed') {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/done-green.png" alt="" width="25">';
    } else {
        return '<img class="pe-1 pb-1" src="https://office.boxcar.site/public/assets/icons/error-red.png" alt="" width="25">';
    }


}

document.addEventListener("DOMContentLoaded", fetchAllCustomers())
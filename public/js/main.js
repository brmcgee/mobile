function el(target) {
    return document.querySelector(target);
}

let pre = `http://localhost:5200`; 
pre = `https://office.boxcar.site`;

customerRoot = el('#customerRoot');

customerRoot.innerHTML = 'Testing'

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
                        </span> 
                        ${d.fname} ${d.lname}
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
    // html += modal('All Jobs');
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
            <a href="https://office.boxcar.site/${data.jImg || ''}">Img</a>
            <a href="https://office.boxcar.site/${data.jScope || ''}  ">Scope</a>
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
    return ` <button onclick="alert(this.id)" id="${custId}" class="btn ms-2 text-black" type="button">
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
        <div class="modal fade" id="allJobsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="allJobsModalLabel">${title}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="allJobsModalBody">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Understood</button>
            </div>
            </div>
        </div>
        </div>
    `;
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
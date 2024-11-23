




























function handleStatus(status){

    let arr = [];

    let jobIds = document.querySelectorAll('.job-card-id');
    let jobIdArr = [];
    jobIds.forEach(job => {
        let jobId = job.innerHTML; 
        jobIdArr.push(jobId);
    })


    let jobStats = document.querySelectorAll('.job-card-stat');
    let count = 0;
    let jobStatArr = [];
    jobStats.forEach(job => {
        let jobStat = job.innerHTML; 
        jobStatArr.push(jobStat)
        arr.push( {
            'status' : jobStat,
            'jobId' : jobIdArr[count++]
        })
    })
    
    let filteredArr = [];
    arr.forEach(a => {
       (a.status.toLowerCase().includes(status.toLowerCase()) && filteredArr.push(a))
    })

    hideCardsFromArray (filteredArr)
}
function hideCardsFromArray (filteredArr) {
    
    let jobIdArr = [];
    filteredArr.forEach(f => {
        jobIdArr.push(f.jobId)
    })



    // let chips = document.querySelectorAll('.chip');
    // chips.forEach(c => {
    //     if (!jobIdArr.includes(c.id.slice(4))) { 
    //         c.style.display = 'none'
    //     }  
    // })
    customerRoot.innerHTML = '';
    console.log(filteredArr)
     filteredArr.forEach(f => {
        customerRoot.innerHTML += `status ${f.status} jobid ${f.jobId}<br>`
     })



}


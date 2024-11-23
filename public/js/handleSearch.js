function handleSearchLastName(que) {
    let chips = document.querySelectorAll('.chip');
    chips.forEach(c => {
        c.style.display = 'none'
    })

    let namesEl = document.querySelectorAll('.lname');
    let arr = [];
    namesEl.forEach(el => {
        let custId = el.id;
        arr.push(
            {'lname': el.innerHTML.trim(),
             'custId' : custId
            })
    })

    let filteredArr = [];
    arr.forEach(a => {
       
        if (a.lname.toLowerCase().includes(que.toLowerCase())) {
            filteredArr.push(a)
        }
    })


    filteredArr.forEach(a => {
        document.getElementById(`chip${a.custId}`).style.display = 'block';
    })
}
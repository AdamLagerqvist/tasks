window.addEventListener('load', () => {
    const checkboxes = document.querySelectorAll('input[type=checkbox]')

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) =>{
            const id = e.target.id.slice(5)
            console.log(e.target.checked, id)
            
            const url = `/tasks/${id}/complete`;

            fetch(url, {
                method: 'POST'
            }).then(response => {
                console.log(response)
            }).catch(error => {
                console.error(error)
            })
        })
    })
})
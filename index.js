const container = document.getElementById('container')


//fetch the api 
fetch("http://localhost:3000/quotes").then(function(res) {
        return res.json()
    })
    .then(function(quotes) {
        //console.log(quote[0].content)
        quotes.forEach(function(quote) {

            const head = document.createElement("h2")
            head.innerText = quote.topic
                //document.body.appendChild(head)
            container.appendChild(head)

            const qut = document.createElement('p')
            qut.innerText = quote.content
            container.appendChild(qut)
        })

    })
const quote_form = document.getElementById("input_form")

const renderQuote = (quote, u) => {
    const container = document.createElement('div')
    const head = document.createElement("h2")
    head.innerText = this.topic
        //document.body.appendChild(head)
    container.appendChild(head)

    const qut = document.createElement('p')
    qut.innerText = this.content
    container.appendChild(qut)
        //document.body.appendChild(qut)

    const bloger = document.createElement('p')
    bloger.innerText = `by: ${u.attributes.username}`
    container.appendChild(bloger)


    const del = document.createElement("button")
    del.innerText = "Delete"
    del.addEventListener("click", (e) => this.delete(e));
    container.appendChild(del);
    dispQuotes.appendChild(container);

};

//fetch the api 
fetch("http://localhost:3000/quotes").
then(function(res) {
        return res.json()
    })
    .then(function(quotes) {
        console.log(quotes)
        quotes.data.forEach(function(quote) {
            const u = quotes.included.find((u) =>
                u.id == quote.relationships.user.data.id);
            //console.log(quotes.data)
            const quteTest = new blogQuote(quote)
                //debugger;
                //quteTest.display();
                // renderQuote(quote, u)

        });
        blogQuote.displayAll()
    });


//Create a quote 
const createQuote = (quotesAtt) => {
    // return fetch("http://localhost:3000/quotes", {
    //         method: 'POST', // or 'PUT'
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(quotesAtt),
    //     })
    //     .then((res) => res.json())
    //     .then((quotes) => {
    //         const u = quotes.included[0];
    //         renderQuote(quotes.data, u)
    //     });
};

const handleForm = (e) => {
    e.preventDefault();
    //debugger
    const quote = new blogQuote({
        attributes: { topic: topic.value, content: content.value },
        username: username.value,
    });

    quote.persist();

    //debugger;
    // createQuote({
    //     quote: {
    //         topic: topic.value,
    //         content: content.value,
    //         username: username.value
    //     },
    // }).then(() => {
    //     e.target.reset();
    // });

}

quote_form.addEventListener("submit", handleForm);


class blogQuote {
    static all = [];
    constructor({ id, username, attributes: { topic, content }, }) {
        this.topic = topic;
        this.content = content;
        //this.bloger = bloger;
        this.id = id;
        this.username = username;
        this.constructor.all.push(this);
    }
    static displayAll() {
        dispQuotes.innerHTML = ""
        this.all.forEach((q) => {
            q.display();
        })
    }

    display() {
        const container = document.createElement('div')
        const head = document.createElement("h2")
        head.innerText = this.topic
            //document.body.appendChild(head)
        container.appendChild(head)

        const qut = document.createElement('p')
        qut.innerText = this.content
        container.appendChild(qut)
            //document.body.appendChild(qut)

        // const bloger = document.createElement('p')
        // bloger.innerText = `by: ${u.attributes.username}`
        // container.appendChild(bloger)


        const del = document.createElement("button")
        del.innerText = "Delete"
        del.addEventListener("click", (e) => {
            fetch(`http://localhost:3000/quotes/${this.id}`, {
                method: "DELETE",
            }).then(container.remove());
        });
        container.appendChild(del);
        document.body.appendChild(container);

    }
    persist() {
        fetch("http://localhost:3000/quotes", {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quote: {
                        topic: this.topic,
                        content: this.content,
                        username: this.username
                    },
                }),
            })
            .then((res) => res.json())
            .then((quotes) => {
                if (quotes.errors) {
                    console.log(quotes.errors)
                } else {
                    //e.target.reset();
                    quote_form.reset()
                    this.id = quotes.data.id;
                    this.constructor.displayAll()
                        // const u = quotes.included[0];
                        // renderQuote(quotes.data, u)
                }
            });
    }

    delete(e) {
        //debugger
        fetch(`http://localhost:3000/quotes/${this.id}`, {
            method: "DELETE",
        }).then(e.target.parentElement.remove());

    }
}
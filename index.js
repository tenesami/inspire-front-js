const form_input = document.getElementById("input_form")

//fetch the api 
fetch("http://localhost:3000/quotes").
then(res => res.json())

.then((quotes) => {
    console.log(quotes)
    quotes.data.forEach(function(quote) {
        const u = quotes.included.find((u) =>
            u.id == quote.relationships.user.data.id);
        //console.log(quotes.data)
        const newQuote = new blogQuote(quote, u)
    });
    blogQuote.displayAll()
});


//Create a quote 
const handleForm = (e) => {
    e.preventDefault();
    //debugger
    //if (e.target.value != "") {
    const quote = new blogQuote({
        attributes: {
            topic: topic.value,
            content: content.value
        },
        username: username.value,
    });
    quote.persist();
    // }

}

form_input.addEventListener("submit", handleForm);


class blogQuote {
    static all = [];

    constructor({ id, username, attributes: { topic, content }, }) {
        this.topic = topic;
        this.content = content;
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
        container.appendChild(head)

        const qut = document.createElement('p')
        qut.innerText = this.content
        container.appendChild(qut)

        const del = document.createElement("button")
        del.innerText = "Delete"
        del.addEventListener("click", (e) => this.delete(e));
        container.appendChild(del);

        dispQuotes.appendChild(container);
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
                    form_input.reset()
                    this.id = quotes.data.id;
                    this.constructor.displayAll()
                }
            });
    }

    delete() {
        fetch(`http://localhost:3000/quotes/${this.id}`, {
            method: "DELETE",
        }).then(() => {
            this.constructor.all = this.constructor.all.filter((q) => {
                return q != this;
            })
            this.constructor.displayAll();
        });
    }
}
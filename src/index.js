document.addEventListener('DOMContentLoaded', (e) => {
    
    
    const getAllQuotes = () => {

        fetch('http://localhost:3000/quotes?_embed=likes')
        .then(res => res.json())
        .then(json => json.forEach(quote => renderQuote(quote)))
    }

    getAllQuotes()

    const createQuote = () => {
        let form = document.getElementById('new-quote-form')
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            let data = {
                quote: e.target[0].value,
                author: e.target[1].value
            }
            fetch('http://localhost:3000/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(json => {
                renderQuote(json)
                form.reset()
            })
        })
    }

    createQuote()

    const renderQuote = (quote) => {
        let ul = document.getElementById('quote-list')
        let li = document.createElement('li')
        li.className = 'quote-card'
        li.innerHTML = `
            <blockquote class="blockquote" id="${quote.id}">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        `
        ul.appendChild(li)

        let blockquote = document.getElementById(quote.id)
        let deleteButton = blockquote.querySelector('.btn-danger')
        let likeButton = blockquote.querySelector('.btn-success')

        deleteButton.addEventListener('click', (e) => {
            e.preventDefault()
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'DELETE'})
            .then(res => res.json())
            .then(json => ul.removeChild(li))
        })

        likeButton.addEventListener('click', (e) => {
            e.preventDefault()

            let data = {
                quoteId: parseInt(quote.id),
                createdAt: Date.now()
            }

            likeButton.innerText = `Likes: ${quote.likes ? quote.likes.length + 1 : 1}`

            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        })
    }
});
// populate page with quotes
const fetchAllQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(json => json.forEach(quote => fetchOneBookLikes(quote)))
}

// fetch likes
const fetchOneBookLikes = (quote) => {
    fetch(`http://localhost:3000/likes?quoteId=${quote.id}`)
    .then(res => res.json())
    .then(json => buildOneQuote(quote, json))
}

const quoteList = document.getElementById('quote-list')

const buildOneQuote = (quote, likes) => {
    let quoteLi = document.createElement('li')
    quoteLi.class = 'quote-card'
    quoteLi.id = quote.id
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${likes.length}</span></button>
        <button class='btn-warning'>Edit</button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    `
    let deleteButton = quoteLi.querySelector('.btn-danger')
    deleteButton.addEventListener('click', () => deleteQuote(quote))

    let likeButton = quoteLi.querySelector('.btn-success')
    likeButton.addEventListener('click', () => likeQuote(quote))

    let editButton = quoteLi.querySelector('.btn-warning')
    editButton.addEventListener('click', () => editQuoteForm(quote))

    quoteList.appendChild(quoteLi)
}

// form submission
const newQuoteForm = document.getElementById('new-quote-form')
newQuoteForm.addEventListener('submit', (e) => submitNewQuote(e))

const submitNewQuote = e => {
    e.preventDefault()
    let newQuote = {
        quote: e.target[0].value,
        author: e.target[1].value
    }

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
    .then(res => res.json())
    .then(() => {
        quoteList.innerHTML = ""
        fetchAllQuotes()
    })

    newQuoteForm.reset()
}

// delete quote
const deleteQuote = quote => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
    .then(res => res.json())
    .then(() => {
        quoteList.innerHTML = ""
        fetchAllQuotes()
    })
}

// like button
const likeQuote = quote => {
    let newLike = {
        quoteId: quote.id,
        createdAt: Math.round(Date.now() / 1000)
    }

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newLike)
    })
    .then(res => res.json())
    .then(() => {
        quoteList.textContent = ""
        fetchAllQuotes()
    })
}

// edit button
const body = document.querySelector('body')
const editQuoteDiv = document.createElement('div')
editQuoteDiv.id = 'edit-quote'

const editQuoteForm = (quote) => {
    newQuoteForm.style.display = 'none'
    editQuoteDiv.innerHTML = ""
    let editQuoteForm = document.createElement('form')
    editQuoteForm.id = 'edit-quote-form'
    editQuoteForm.innerHTML = `
        <div class="form-group">
            <label for="edit-quote">Edit Quote</label>
            <input name="quote" type="text" class="form-control" id="edit-quote" value='${quote.quote}'>
        </div>
        <div class="form-group">
            <label for="Author">Author</label>
            <input name="author" type="text" class="form-control" id="author" value='${quote.author}'>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    `

    editQuoteForm.addEventListener('submit', (e) => editQuoteSubmit(e, quote))
    editQuoteDiv.appendChild(editQuoteForm)
    body.appendChild(editQuoteDiv)
}

const editQuoteSubmit = (e, quote) => {
    e.preventDefault()

    let editedQuote = {
        quote: e.target[0].value,
        author: e.target[1].value
    }

    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(editedQuote)
    })
    .then(res => res.json())
    .then(() => {
        quoteList.innerHTML = ""
        fetchAllQuotes()
    })

    editQuoteDiv.innerHTML = ""
    newQuoteForm.style.display = 'block'
}

// sorted by author
const sortButton = document.createElement('button')
sortButton.className = 'btn btn-dark'
sortButton.textContent = 'Sort by Author: OFF'
sortButton.addEventListener('click', () => handleSort())
document.querySelector('div').prepend(sortButton)

const handleSort = () => {
    if (sortButton.textContent === 'Sort by Author: OFF') {
        sortButton.textContent = 'Sort by Author: ON'
        quoteList.innerHTML = ""
        fetchByAuthor()
    } else {
        sortButton.textContent = 'Sort by Author: OFF'
        quoteList.innerHTML = ""
        fetchAllQuotes()
    }
}

const fetchByAuthor = () => {
    fetch('http://localhost:3000/quotes?_sort=author')
    .then(res => res.json())
    .then(json => json.forEach(quote => fetchOneBookLikes(quote)))
}

// method calls
fetchAllQuotes()
document.addEventListener('DOMContentLoaded', () => {
    fetchAllQuotes()
    createNewQuoteForm()
})

const fetchAllQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(json => json.forEach(quote => showQuote(quote)))
}

const showQuote = (quote) => {
    const quoteList = document.querySelector('#quote-list')
    let li = document.createElement('li')
    li.id = quote.id
    li.className = 'quote-card'

    let blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'

    let p = document.createElement('p')
    p.innerHTML = quote.quote
    blockquote.appendChild(p)

    let footer = document.createElement('footer')
    footer.innerHTML = quote.author
    blockquote.appendChild(footer)

    let br = document.createElement('br')
    blockquote.appendChild(br)

    let btnSuccess = document.createElement('button')
    btnSuccess.className = 'btn-success'
    btnSuccess.innerHTML = `Likes: ${quote.likes.length}`
    blockquote.appendChild(btnSuccess)
    btnSuccess.addEventListener('click', (e) => {
        likeQuote(e, quote)
    })

    let btnDanger = document.createElement('button')
    btnDanger.className = 'btn-danger'
    btnDanger.innerHTML = "Delete"
    blockquote.appendChild(btnDanger)
    btnDanger.addEventListener('click', (e) => {
        deleteQuote(e, quote)
    })

    let btnEdit = document.createElement('button')
    btnEdit.className = '.btn-edit'
    btnEdit.innerHTML = "Edit"
    blockquote.appendChild(btnEdit)
    btnEdit.addEventListener('click', (e) => {
        editQuote(e, quote)
    })


    li.appendChild(blockquote)
    quoteList.appendChild(li)
}

const createNewQuoteForm = () => {
    const newQuoteForm = document.querySelector('#new-quote-form')
    newQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault()
        createQuote(e)
    })
    
}

const createQuote = (e) => {
    let data = {
        quote: e.target[0].value,
        author: e.target[1].value,
        likes: []
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
            showQuote(json)
        })
}

const deleteQuote = (e, quote) => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE',
        })
        .then(res => res.json())
        .then(json => {
            let currentLi = document.getElementById(quote.id)
            currentLi.remove()
    })
}

const likeQuote = (e, quote) => {
    let data = {
        quoteId: quote.id,
        createdAt: Date.now()
    }

    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(json => {
            updateLikesView(quote)
        })      
}

const updateLikesView = (quote) => {
    let currentLi = document.getElementById(quote.id)
    let btnSuccess = currentLi.querySelector('.btn-success')
    btnSuccess.textContent = `Likes: ${quote.likes.length}`
}
const editQuote = (e, quote) => {
    const editForm = document.querySelector('#new-quote-form')
	fetch(`http://localhost:3000/quotes/${quote.id}`)
	.then(res => res.json())
	.then(json => {
        editForm[0].value = quote.quote
        editForm[1].value = quote.author
    })
    editForm.removeEventListener('submit', (e) => {
        e.preventDefault()
        createQuote(e)
    })
	editForm.addEventListener('submit', (e) => {
        e.preventDefault()
        patchQuote(e, quote)
    })
}

const patchQuote = (e, quote) => {

    let data = {
        quote: e.target[0].value,
        author: e.target[1].value,
    }

    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(json => {
            let li = document.querySelector(quote.id)
            let p = li.querySelector('p')
            p.innerHTML = e.target[0].value
    })
}
fetch('http://localhost:3000/quotes')
.then(resp => resp.json())
.then(function(json){
    renderQuotes(json)
})

function renderQuotes(json){
    let ul = document.getElementById('quote-list')
    json.forEach(quote =>{
        let li = document.createElement('li')
        li.innerHTML = `<li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>0</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>`
      ul.appendChild(li)
    })
}

function newQuote(e, quote, author){
    e.preventDefault()
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({quote: quote, author: author})
    })
    .then(resp => resp.json())
    .then(data =>{
        let quote = document.getElementById('new-quote')
        let author = document.getElementById('author')
        let ul = document.getElementById('quote-list')
        let li = document.createElement('li')
        li.innerHTML = `<li class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${quote.value}</p>
          <footer class="blockquote-footer">${author.value}</footer>
          <br>
          <button class='btn-success'>Likes: <span>0</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      </li>`
      ul.appendChild(li)
    })
}

document.addEventListener('click', (e) => newQuote(e))
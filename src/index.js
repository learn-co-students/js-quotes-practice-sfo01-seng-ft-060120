
const urlQuoteLikes = "http://localhost:3000/quotes?_embed=likes"
const form = document.getElementById('new-quote-form')

//GET REQUEST
const fetchQuotes = () => {
  fetch(urlQuoteLikes)
  .then(res => res.json())
  .then(json => json.forEach(quote => buildQuoteCard(quote))) //array 
}

fetchQuotes()

const buildQuoteCard = (quotes) => {  

  const ul = document.getElementById('quote-list')
  const li = document.createElement('li')
  li.className = "quote-card"
  li.id = quotes.id
  li.innerHTML += `
  <blockquote class="blockquote">
    <p class="mb-0">${quotes.quote}.</p>
    <footer class="blockquote-footer">${quotes.author}</footer>
    <br>
    <button class='btn-success'>likes:${quotes.likes} <span>0</span></button>
    <button class='btn-danger' data-delete='delete-btn'>Delete</button>
  </blockquote>
  </li>
  `
  ul.appendChild(li)
  // remember to grab the ID of the cards and put an even listener on their buttons!
  // likes button here
  const card = document.getElementById(quotes.id)
  const likesBtn = card.querySelector('.btn-success')

  likesBtn.addEventListener('click', (e) => {
    incrementLike(e, quotes)
    }) 

  // deleteButton
  const deleteBtn = card.querySelector('.btn-danger')
  deleteBtn.addEventListener('click', () => {
    deleteCurrentQuote(quotes, li)
      // console.log(quotes)
  // console.log(deleteBtn)
  })

} 

// POST REQUEST

  const incrementLike = (e, quotes) => {

fetch('http://localhost:3000/likes', {
  method: 'POST',
  header: {
    "Content-Type" : "application/json"
  },
  body: JSON.stringify({"quoteID": quotes.id})
})
.then(res => res.json())
.then(json => {
  let spanButton = e.target.firstElementChild
  let count = parseInt(spanButton.textContent) 
  count += 1
  spanButton.innerText = count 
})
} 

// ADD A NEW QUOTES TO THE LIST
const listenForSubmit = () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    postNewQuotes(e)
  })
}
listenForSubmit()

const postNewQuotes = (e) =>{
 data = {
   "quote": e.target[0].value,
   "author": e.target[1].value,
   "likes": 0
 }

 fetch(urlQuoteLikes, {
   method: "POST",
   headers: {
     "Content-Type": "application/json"
   },
   body: JSON.stringify(data)
 })
 .then(res => res.json())
 .then(json => buildQuoteCard(json))
}

//Delete Quotes

const deleteCurrentQuote = (quotes) => {
  // console.log(quotes)
 fetch(`http://localhost:3000/quotes/${quotes.id}`, {
   method: 'Delete'
 })
 .then(res => res.json())
 .then(json => {
   const deleteCard = document.getElementById(quotes.id)
   deleteCard.remove()
   console.log(deleteCard)
 })
}
deleteCurrentQuote()



const urlQuoteLikes = "http://localhost:3000/quotes?_embed=likes"
const form = document.getElementById('new-quote-form')
const sortBtn = document.getElementById('sort')
//GET REQUEST
const fetchQuotes = () => {
  fetch(urlQuoteLikes)
  .then(res => res.json())
  .then(json => json.forEach(quote => buildQuoteCard(quote))) //array 
}
fetchQuotes()

// edit function
const editCurrentQuote = (quotes) => {
let editForm = document.getElementById('new-quote-form')

let editQuote = editForm[0]
let editAuthor = editForm[1]
let editButton = editForm[2]

editQuote.value = quotes.quote 
editAuthor.value = quotes.author 
editButton.textContent = "Edit"

editForm.removeEventListener('submit', (e) => { 
  listenForSubmit(e)
}) //get this to remove but dont remove it from code 
editForm.addEventListener('submit', (e) => {
  patchEditForm(e, quotes)
  editForm.reset()
})
} 
// FIX THE EDIT SO THAT IT GOES BACK TO SUBMIT AFTER 

const patchEditForm = (e, quotes) => {
  let newEditForm = document.getElementById('new-quote-form')

console.log(e)
  let data = {
    "quote": e.target[0].value,
    "author": e.target[1].value
  }

  fetch( `http://localhost:3000/quotes/${quotes.id}`,{
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(json => {
    // newEditForm[0].innerText = quotes.quote
    // newEditForm[1].innerText = quotes.author
    // THE EDIT DOESNT CHANGE THE ORIGINAL FIX THIS
  })
}

const buildQuoteCard = (quotes) => {  
  const ul = document.getElementById('quote-list')
  const li = document.createElement('li')
  li.className = "quote-card"
  li.id = quotes.id
  li.innerHTML = `
  <blockquote class="blockquote">
    <p class="mb-0">${quotes.quote}.</p>
    <footer class="blockquote-footer">${quotes.author}</footer>
    <br>
    <button class='btn-success'>likes:${quotes.likes} <span>0</span></button>
    <button class='btn-danger' data-delete='delete-btn'>Delete</button>
    <button class='btn-primary' data-edit='edit-btn' id="${quotes.id}">Edit</button>

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
    // keepLikes(quotes, e)
    }) 

  // deleteButton
  const deleteBtn = card.querySelector('.btn-danger')
  deleteBtn.addEventListener('click', () => {
    deleteCurrentQuote(quotes)
      // console.log(quotes)
  // console.log(deleteBtn)
  })

  const editBtn = card.querySelector('.btn-primary')
  editBtn.addEventListener('click', (e) => {
    editCurrentQuote(quotes, e)
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
  spanButton.textContent = count 
})
} 
// LIKES GET REQUEST
// const keepLikes = (quotes, e) => {
//   console.log(quotes)
// fetch(`http://localhost:3000/likes?quoteId=${quotes.id}`)
// .then(res => res.json())

// }

// LIKES END HERE

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

 })
}

sortBtn.addEventListener('click', () => {
  console.log(sortBtn)
  const sortUl = document.querySelector('ul')
  sortUl.innerText = ""
  fetch(`http://localhost:3000/quotes?_sort=author`)
  .then(res => res.json())
  .then(json => json.forEach(quote => buildQuoteCard(quote)))
})

// nt sorting correctly!


//const { default: axios } = require("axios");

//SEARCH PRODUCT VARIABLES
const inputSearch = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

//COMMENT VARIABLES
const sendBtn = document.getElementById("send-btn");
const commentInput = document.getElementById("comment-input")
const commentsContainer = document.getElementById("comments-container")

// COMMENTS

// DOM logic

function publishComment(input) {
  console.log('publishing input: ', input.content, input.author)
  commentsContainer.innerHTML += `<div>
  <div>${input.content}</div>
</div>`
}

// AJAX handler
function createCommentInDB(comment) {
  console.log('new comment is : ', comment)
  return axios.post(`/staff/product/${document.getElementById("product-id").innerHTML}`, comment)
}

// DOM event handlers
function handleCreateComment(input, callback) {
  createCommentInDB({
    product: document.getElementById("product-id").innerHTML,
    content: input,
    date: new Date()
  })
    .then((comment) => {
        console.log("the comment in the db is :", comment.data)
        callback(comment.data)
    })
    .catch((apiError) => console.log(apiError));
}

// DOM event listener
window.addEventListener('load', () => {
  sendBtn.addEventListener('click', () => {
    console.log('clicked')
    if(commentInput.value.length === 0) {
      return
    }
    handleCreateComment(commentInput.value, publishComment)
  })
})

//SEARCH PRODUCT
// DOM logic
function resetSearchResult() {
    resultsContainer.innerHTML = '';
}

function displayResults(products) {
    products.forEach((product) => {
        resultsContainer.innerHTML += `
        <div>
          <div>
          <a href="/staff/product/${product._id}">
          <img src="${product.images[product.images.length - 1]}" alt="most recent image of product">
          </a>
          </div>
          <div>${product.name}</div>
          <div>${product.serie.season} ${product.serie.year}</div>
        </div>`
    })
}

// AJAX handler
function fetchProductByName(string) {
    let query = string ? `?name=${string}` : "";
    return axios.get(`/api/products${query}`);
  }

// DOM event handlers
function handleRead(evt, callback) {
    fetchProductByName(evt.target.value)
      .then((apiRes) => {
          console.log(apiRes.data);
          callback(apiRes.data)
      })
      .catch((apiError) => console.log(apiError));
  }

// DOM event listener
inputSearch.onkeyup = (evt) => {
    resetSearchResult()
    handleRead(evt, displayResults);
  };


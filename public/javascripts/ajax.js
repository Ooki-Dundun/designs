//const { default: axios } = require("axios");

//SEARCH PRODUCT VARIABLES
const inputSearchProducts = document.getElementById("search-input-products");
const resultsContainerProducts = document.getElementById(
  "results-container-products"
);

//COMMENT VARIABLES
const sendBtn = document.getElementById("send-btn");
const commentInput = document.getElementById("comment-input");
const commentsContainer = document.getElementById("comments-container");

//SEARCH USER VARIABLES
const inputSearchUsers = document.getElementById("search-input-users");
const resultsContainerUsers = document.getElementById(
  "results-container-users"
);

// COMMENTS

// DOM logic

function publishComment(input) {
  console.log("publishing input: ", input.content, input.author, input.date);
  commentsContainer.innerHTML += `<div>
  <div>${input.content}</div>
  <div>${input.author.firstName} ${input.author.lastName}</div>
</div>`;
}

// AJAX handler
function createCommentInDB(comment) {
  console.log("new comment is : ", comment);
  return axios.post(
    `/staff/product/${document.getElementById("product-id").innerHTML}`,
    comment
  );
}

// DOM event handlers
function handleCreateComment(input, callback) {
  createCommentInDB({
    product: document.getElementById("product-id").innerHTML,
    content: input,
    date: new Date(),
  })
    .then((comment) => {
      console.log("the comment in the db is :", comment.data);
      callback(comment.data);
    })
    .catch((apiError) => console.log(apiError));
}

// DOM event listener
window.addEventListener("load", () => {
  if (sendBtn)
    sendBtn.addEventListener("click", () => {
      console.log("clicked");
      if (commentInput.value.length === 0) {
        return;
      }
      handleCreateComment(commentInput.value, publishComment);
    });
});

//SEARCH PRODUCT
// DOM logic
function resetSearchResult() {
  resultsContainerProducts.innerHTML = "";
}

function displayResults(products) {
  products.forEach((product) => {
    resultsContainerProducts.innerHTML += `
        <div>
                <a href="/staff/product/${product._id}">
                    <img src="${
                      product.images[product.images.length - 1]
                    }" alt="most recent image of product" class="product-image">
                </a>
                <div class="product-info">${product.name}</div>
                <div class="product-info">${product.serie.season} ${
      product.serie.year
    }</div>

        </div>`;
  });
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
      callback(apiRes.data);
    })
    .catch((apiError) => console.log(apiError));
}

// DOM event listener
if (inputSearchProducts)
  inputSearchProducts.onkeyup = (evt) => {
    resetSearchResult();
    handleRead(evt, displayResults);
  };

//SEARCH USER

function displayResultsUsers(users) {
  users.forEach((user) => {
    resultsContainerUsers.innerHTML += `
      <div>
          <a href="/staff/users/${user._id}">
          ${user.firstName} ${user.lastName}
          </a>
      </div>`;
  });
}

//DOM LOGIC
function resetSearchResultUsers() {
  resultsContainerUsers.innerHTML = "";
}

// AJAX handler
function fetchUserByName(string) {
  let query = string ? `?firstName=${string}` : "";
  return axios.get(`/api/users${query}`);
}

// DOM event handlers
function handleReadUserSearch(evt, callback) {
  fetchUserByName(evt.target.value)
    .then((apiRes) => {
      console.log(apiRes.data);
      callback(apiRes.data);
    })
    .catch((apiError) => console.log(apiError));
}

// DOM event listener
if (inputSearchUsers)
  inputSearchUsers.onkeyup = (evt) => {
    resetSearchResultUsers();
    handleReadUserSearch(evt, displayResultsUsers);
  };

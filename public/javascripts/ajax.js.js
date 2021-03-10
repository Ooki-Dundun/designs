const inputSearch = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

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
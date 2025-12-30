
const cartButton = document.querySelector('.fa-btn')
const productsButton = document.querySelector('.productSymbol')
const seconSite = document.querySelector('.seconContainer')
const firstSite = document.querySelector('.container')
const loading = document.querySelector('.loadingText')
const productlist = document.querySelector('.productList')
const placeOfCarts = document.querySelector('.cartitem')
const buttonCategories = document.querySelector('.buttonCategory')
const Input = document.querySelector('.search-input')

cartButton.addEventListener('click', () => { firstSite.style.display = 'none', seconSite.style.display = 'block' });
productsButton.addEventListener('click', () => { firstSite.style.display = 'block', seconSite.style.display = 'none' });



let cart = JSON.parse(localStorage.getItem("cart")) || [];


const getDataFromApi = async () => {

  const res = await fetch('https://fakestoreapi.com/products')
  const data = await res.json();
  loading.style.display = 'none'


  console.log(data);

  const makeButton = data.reduce((acc, item) => {

    if (!acc.includes(item.category)) {
      acc.push(item.category)

    }
    return acc

  }, ['all'])











  handelButtons(makeButton)
  renderProductSite(data)
  showItemsInCart()
  saveinLocalStorage()

}


const renderProductSite = (data) => {

  data.forEach(item => {


    const { image, title, price, category, id } = item

    const backToDom = document.createElement('div')

    backToDom.classList = 'productItem';

    backToDom.innerHTML = `

                <img src="${image}" alt="">

                <h3> ${titleLower(title)}</h3>

               <div>

                   <p> $ <span> ${price} </span> </p>

                   <button  class="addtocartbtn" data-id=${id} > Add to Cart</button>

               </div>
     `

    productlist.appendChild(backToDom)

    const cartBtn = backToDom.querySelector('.addtocartbtn').addEventListener('click', (e) => {

      const value = parseInt(e.target.dataset.id);
      const find_The_Id = data.find(i => i.id === value);

      saveToCart(find_The_Id)

    })
  })

}

///save item in Cart

const saveToCart = (item) => {

  const add = cart.find(s => s.id === item.id)

  if (!add) { cart.push({ ...item, quantity: 1 }) }

  else { add.quantity++ }

  showItemsInCart()
  saveinLocalStorage()

}

const showItemsInCart = () => {
  placeOfCarts.innerHTML = ""

  cart.forEach(item => {

    const { id, price, image, quantity, title } = item

    const cartItem = document.createElement('div');
    cartItem.classList = 'cartTable';

    cartItem.innerHTML = `


                      <img src="${image}" alt="">

                          <p> ${titleLower(title)} </p>

                       <h2> $${price} </h2>

             <div class="minusDiv">

                       <i class="fa fa-plus"></i>

                          <span>${quantity}</span>
 
                      <i class="fa fa-minus"></i>

            </div>

              <i class="fa fa-times"></i>
     
       `

    placeOfCarts.appendChild(cartItem);


    const minusButton = cartItem.querySelector('.fa-minus')
    minusButton.addEventListener('click', (e) => {
      e.preventDefault()
      decreaseBtn(item)
    });

    const plusButton = cartItem.querySelector('.fa-plus')
    plusButton.addEventListener('click', (e) => {

      e.preventDefault()
      increaseBtn(item)

    });
    const deletButton = cartItem.querySelector('.fa-times')
    deletButton.addEventListener('click', (e) => {
      e.preventDefault()
      deletBtn(item)
    });

  })
}

const decreaseBtn = (item) => {

  const finding = cart.find(i => i.id === item.id)

  if (finding.quantity > 1) {
    finding.quantity--
  }

  saveinLocalStorage()
  showItemsInCart()

}

const increaseBtn = (item) => {

  const finding = cart.find(i => i.id === item.id);

  if (finding) { finding.quantity++ }

  saveinLocalStorage()
  showItemsInCart()

}

const deletBtn = (item) => {

  const finding = cart.findIndex(i => i.id === item.id);
  cart.splice(finding, 1);
  saveinLocalStorage()
  showItemsInCart()

}


///here is handel all button on DOM


//Rendering

const handelButtons = (buttons) => {

  buttons.forEach(category => {

    const btn = document.createElement('span')
    btn.classList = 'allbtns';

    btn.innerHTML = `
    
           <button data-category="${category}" type="button" onclick="searchItemCategory(this)"
           
           class="catbtn" >  ${category} </button>
    `
    buttonCategories.appendChild(btn)

  })

}


const searchItemCategory = async (it) => {

  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  productlist.innerHTML = ""
  loading.style.display = 'none'

  const index = it.dataset.category
  // console.log(index);

  const filtring = data.filter(i => i.category === index)
  // console.log(filtring);

  if (index == 'all') {
    productlist.innerHTML = ""
    renderProductSite(data)
  }

  renderProductSite(filtring)
  saveinLocalStorage()

}



Input.addEventListener('input', async (e) => {

  const value = e.target.value

  const yeees = await fetchTheValue(value)
  renderProductSite(yeees)

})


const fetchTheValue = async (value) => {

  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  productlist.innerHTML = ""
  loading.style.display = 'none'


 const filterValue = data.filter( item => { 
  return item.title.toLowerCase().includes(value.toLowerCase().trim())

 } )


return filterValue






}
















//title product to shorting

const titleLower = (title) => {

  const shortIt = title.split(" ");

  if (shortIt.length > 1) {
    return `${shortIt[0]}  ${shortIt[1]} ...`
  }
  else { return shortIt }

}

const saveinLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cart))
}


















getDataFromApi()
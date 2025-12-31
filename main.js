
const cartButton = document.querySelector('.fa-btn')
const productsButton = document.querySelector('.productSymbol')
const seconSite = document.querySelector('.seconContainer')
const firstSite = document.querySelector('.container')
const loading = document.querySelector('.loadingText')
const productlist = document.querySelector('.productList')
const placeOfCarts = document.querySelector('.cartitem')
const buttonCategories = document.querySelector('.buttonCategory')
const Input = document.querySelector('.search-input')
const errorText = document.querySelector('.notexist')
const cartMessage = document.querySelector('.errorCart')
const cartWrapper = document.querySelector('.cartWrapperButton')
const totalPrice = document.querySelector('.pricing')
const clearButton = document.querySelector('.btnc')
const sendButton = document.querySelector('.btns')
const numberOfItem = document.querySelector('.number')



cartButton.addEventListener('click', () => {

  firstSite.style.display = 'none';
  seconSite.style.display = 'block';
  Input.value = "";
});

productsButton.addEventListener('click', () => {

  firstSite.style.display = 'block';
  seconSite.style.display = 'none';
  Input.value = "";

});



let cart = JSON.parse(localStorage.getItem("cart")) || [];


const getDataFromApi = async () => {

  const res = await fetch('https://fakestoreapi.com/products')
  const data = await res.json();
  loading.style.display = 'none'
  cartMessage.style.display = '';
  cartMessage.style.display = 'block';
  productlist.innerHTML = ""


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

///save items in Cart

const saveToCart = (item) => {

  const add = cart.find(s => s.id === item.id)
  if (!add) { cart.push({ ...item, quantity: 1 }) }
  else { add.quantity++ }

  showItemsInCart()
  saveinLocalStorage()

}

const showItemsInCart = () => {
  placeOfCarts.innerHTML = ""


  if (cart.length === 0) {
    cartMessage.style.display = 'block';
    cartMessage.textContent = 'cart is empty !'
    cartWrapper.style.display = 'none';


  } else {
    cartMessage.style.display = 'none';
    cartMessage.textContent = '';
    cartWrapper.style.display = 'block';
  }


  
  ///item prices in cart

  const totalP = cart.reduce((total, item) => {
    return total + item.quantity * item.price

  }, 0)

  totalPrice.textContent = totalP.toLocaleString('en-US');


  ///item quantity on basket

  const itemQuantity = cart.reduce((acc, item) => {
    return acc + item.quantity
  }, 0)

  numberOfItem.textContent = itemQuantity


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

  showItemsInCart()
  saveinLocalStorage()


}


///here is handel all button on DOM


//Rendering 

const handelButtons = (buttons) => {
  productlist.innerHTML = ""

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
  Input.value = ""

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

  if (yeees.length === 0) {
    errorMessage('product not found !')
    buttonCategories.style.display = 'none';

  }

  else {
    renderProductSite(yeees)
    hideError()
    buttonCategories.style.display = 'block';

  }


  /// here is about focusing on input 
  if (Input.value.length !== 0) {
    firstSite.style.display = 'block';
    seconSite.style.display = 'none';
  }
})



const fetchTheValue = async (value) => {

  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  productlist.innerHTML = "";
  loading.style.display = 'none';

  const filterValue = data.filter(item => {
    return item.title.toLowerCase().includes(value.toLowerCase().trim())
  })

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

/// error handeling

const errorMessage = (err) => {
  errorText.textContent = err;
  errorText.style.display = 'block';
  cartMessage.textContent = err;
  cartMessage.style.display = 'block';
}

const hideError = () => {
  errorText.textContent = "";
  errorText.style.display = 'none';
  cartMessage.style.display = 'none';
  cartMessage.style.display = 'none';
}


////handel the cart buttons with sweet Alert

clearButton.addEventListener('click', (e) => {

  e.preventDefault()

  Swal.fire({
    title: "you want to delet your Cart ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "delete it!"
  }).then((result) => {
    if (result.isConfirmed) {

      cart.length = 0
      cartWrapper.style.display = 'none'
      saveinLocalStorage()
      showItemsInCart()

      Swal.fire({
        title: "Deleted!",
        icon: "success",

      });
    }
  });
})


sendButton.addEventListener('click', (e) => {

  e.preventDefault()
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: true,
    timer: 2000

  });
  saveinLocalStorage()
  showItemsInCart()

})



getDataFromApi()
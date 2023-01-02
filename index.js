import {menuArray } from './data.js'
let orderArray = []
const comboDiscount = 8
const order = document.getElementById("order")
const checkoutModal = document.getElementById("checkout-modal")
const thankYouMessage = document.getElementById('thankYouMessage-container')
let starRating = 0
const ratingValue = document.getElementById('rating-value')

document.addEventListener('click', (event) => {
    const isOutside = !event.target.closest('.modal-inner');
    if(event.target.dataset.add){
        addItemOrder(event.target.dataset.add)
    }
    else if (event.target.dataset.remove){
        removeItemOrder(event.target.dataset.remove)
    }
    else if (event.target.id === 'order-btn'){
        toggleModal()
    }
    else if (event.target.id === 'dismiss-btn'){
        closeOrder(starRating)
    }
    else if (isOutside){
        checkoutModal.classList.add('hidden')
    }
    else if (event.target.id === 'pay-btn'){
        showThankYouMessage()
    }
})

const toggleModal = () => {
    checkoutModal.classList.toggle('hidden')
}

const closeOrder = (rating) => {
    order.classList.add('hidden')
    alert(`You rated us ${rating} stars!`)
    orderArray =[]
}

const getMenuHtml = () => {
    let menuHtml =''
    
    menuArray.forEach((item) => {
        let ingredientsList = item.ingredients.map(ingredient => `
                <span class="item-ingredient">
                    ${ingredient}
                </span>
        `)
    menuHtml += `
    <div class="menuItem-container">
            <div class="item-emoji">${item.emoji}</div>
            <div class="content-wrapper">
                <p class="item-name">${item.name}</p>
                <div class="item-ingredients">
                    ${ingredientsList}
                </div>   
                <p class="item-price">$${item.price}</p>
            </div>
            <button class="add-btn btn" data-add='${item.id}'>+</button>  
    </div>    
        `
    })
    return menuHtml
}

const renderMenu = () => {
    document.getElementById("menu").innerHTML = getMenuHtml()
} 

renderMenu()

const addItemOrder=(itemId)=> {
    const orderItemObj = menuArray.filter(function(item){
        return item.id == itemId
    })[0]
    orderArray.push(orderItemObj)
    addComboDiscount(orderArray,comboDiscount)
    renderOrder()    
    if(orderArray != 0){
        order.classList.remove('hidden')
    }
}

const removeItemOrder = (index) => {
    orderArray.splice(index,1)
    addComboDiscount(orderArray,comboDiscount)
    renderOrder()
    if(orderArray.length === 0){
        order.classList.add('hidden')
    }
}

const addComboDiscount = (order,comboDiscount) => {
    let discountApplied = false
    let numPizzas = 0;
    let numBeers = 0;
    // Count the number of pizzas and beers in the order
    order.forEach(item => {
        if(item.name === 'Pizza'){
            numPizzas++
        }else if (item.name === 'Beer'){
            numBeers++
        }
    });
    // Calculate the number of combo discounts to apply
    const numCombos = Math.min(numPizzas, numBeers);
    // Remove any existing combo discounts from the order
    orderArray = orderArray.filter(item => item.name !== 'Combo Discount');
    // Add the calculated number of combo discounts to the order
  for(let i = 0; i < numCombos; i++){
    orderArray.push({
      name: 'Combo Discount',
      price: -comboDiscount
    });
    }
}

const getOrderHtml = () => {
    let totalPrice = 0
    let orderHtml = `
        <h2 class="order-title">Your Order</h2>
    `
    orderArray.forEach((orderItem, index) => {
    const {name, price } = orderItem
    
    if (name !== 'Combo Discount') {
    orderHtml += `
      <div class='order-line'>
        <div class="order-wrapper">
          <h3 class='item-name'>${name}</h3>
          <button class='remove-btn btn' data-remove='${index}'>remove</button>
        </div>
        <h3 class="item-price">$${price}</h3>
      </div>
    `
    } else {
      orderHtml += `
      <div class='order-line'>
        <h3 class='item-name'>${name}</h3>
        <h3 class="item-price">$${price}</h3>
      </div>
      `
    }     
    totalPrice += price
    })
    
    orderHtml += `
        <hr>
        <div class="total-price-line">
            <h3 class="total-price">Total Price:</h3>
            <h3 class='total-price'>$${totalPrice}</h3>
        </div>
        <button class="order-btn btn" id="order-btn">Complete order</button>
    `
    return orderHtml
}

const renderOrder=()=> {
    order.innerHTML = getOrderHtml()
}

const showThankYouMessage = (event) => {
    let paymentForm = document.getElementById('payment-form')
    let formData = new FormData(paymentForm)
    const fullName = formData.get('fullName')
    toggleModal()
    order.innerHTML = fullName ? `
        <div class='message-container'>
            <h2>Thanks, ${fullName}! Your order is on its way!</h2>
            <p>We hope you enjoy your meal. Don't forget to rate us:</p>
            <div id="rating-container"></div> 
            <button class='dismiss-btn btn' id='dismiss-btn'>Dismiss</button>
        </div>
    ` : `<div class='message-container'>
            <h2>Thanks You! Your order is on its way!</h2>
            <p>We hope you enjoy your meal. Don't forget to rate us:</p>
            <div id="rating-container"></div> 
            <button class='dismiss-btn btn' id='dismiss-btn'>Dismiss</button>
        </div>`
        
        document.getElementById('rating-container').innerHTML = getRatingHtml()
    
    const ratingContainer = document.getElementById('rating-container');
    ratingContainer.addEventListener('click', handleStarClick);

function handleStarClick(event) {
  if (event.target.classList.contains('star')) {
    const rating = event.target.dataset.rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      if (star.dataset.rating <= rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
    return starRating = rating 
  }
}

}

const getRatingHtml = () => {
    let ratingHtml =''
    for (let i = 1; i <= 5; i++){
        ratingHtml += `
            <span class='star' id='star' data-rating=${i}>
                &#9733; 
            </span>
        `
    }
    return ratingHtml;
}


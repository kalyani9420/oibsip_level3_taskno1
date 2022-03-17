// const { parse } = require("dotenv")
import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza){
    //axios lib use widely for production
    axios.post('/update-cart', pizza).then((res) =>{
        console.log(res)
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type : 'success',
            timeout : 1000,
            progressBar : false,
            // layout : 'topLeft',
            text : "Your item added to cart😋"
        }).show();

        // console.log(cartCounter.innerText)
    }).catch(err=>{
        new Noty({
            type : 'error',
            timeout : 1000,
            progressBar : false,
            layout : 'topLeft',
            text : "Something went wrong😕"
        }).show();

    })


}

addToCart.forEach((btn) =>{
    btn.addEventListener('click' , (e) =>{

        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
        // console.log(pizza)
    })
})
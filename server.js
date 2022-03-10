const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
 const expressLayout = require('express-ejs-layouts')
// now app can use as a object which contain all functionality of express
const PORT = process.env.PORT || 3300

//assets
app.use(express.static('public'))



// set Template engine
app.use(expressLayout)
app.set('views' , path.join(__dirname , '/resources/views'))
app.set('view engine' , 'ejs')


//routes - should be after the set template engine
app.get('/' , (req , res) => {
    res.render('home')
})

app.get('/cart' , (req, res) =>{
    res.render('customers/cart')
})

app.get( '/login', (req , res) =>{
    res.render('auth/login')
})
app.get( '/register', (req , res) =>{
    res.render('auth/register')
})

app.listen (PORT , ()=>{
    console.log(`listen on port ${PORT}`)
})

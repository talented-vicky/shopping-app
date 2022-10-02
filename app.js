const path = require('path');
const express = require('express');
const bp = require('body-parser'); 

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error')

const app = express();

app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use('/admin', adminRoutes) //filtering all paths from adminRoutes

app.use(shopRoutes) // its ideal this comes before admin routes
app.use(errorController.errorPage)

app.listen(4000) //this creates server and listens too


// // 2) Given an array of integers, find the sum of its elements
// const simpleArraySum = array => {
//     var tot = 0;
//     for(var i = 0; i < array.length; i++){
//         tot = tot + array[i]       
//     }
//     console.log(tot)
// }
// simpleArraySum([2, 4, 6])


// // 3) The task is to find their comparison points by comparing a[0] 
// // with b[0], a[1] with b[1], and a[2] with b[2].
// const compareTriplets = (Alice, Bob) =>{
//     var aliceTot = 0;
//     var bobTot = 0;
//     Alice.forEach((elem, ind) => {
//         console.log(elem, ind)
//         var bobComp = Bob[ind]
//         switch(true){
//             case elem > bobComp:
//                 aliceTot += 1
//             case elem < bobComp:
//                 bobTot += 1
//             default:
//         }
//     });
//     console.log(`Alice gets ${aliceTot}, while Bob gets ${bobTot}`)
// }
// // compareTriplets([1, 3, 4, 6], [2, 5, 8, 2])
// compareTriplets([5, 6, 11], [3, 4, 10])
// // I'm adding Alice's cores to Bob's somehow

// const compareTriplets = (Alice, Bob) =>{
//     var alicePoint = 0;
//     var bobPoint = 0;
//     Alice.forEach(elem => {
//         Bob.forEach(val => {
//             switch(true){
//                 case elem > val:
//                     alicePoint = alicePoint + 1
//                 case val > elem:
//                     bobPoint = bobPoint + 1
//             }
//         })
//     });
//     console.log(`Alice gets ${alicePoint}, while Bob gets ${bobPoint}`)
// }


// fizzBuzz for pass
// const fizzBuzz = n => {
//     for(var i = 1; i <= n; i++){
//         switch(true){
//             case i%5 === 0 && i%3 === 0:
//                 console.log("FizzBuzz")
//                 break
//             case i%5 === 0:
//                 console.log("Fizz")
//                 break
//             case i%3 === 0:
//                 console.log("Fizz")
//                 break
//             default:
//                 console.log(i)
//                 break
//         }
//     } 
// }
// fizzBuzz(15)

// const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

// const sameRow = word => {
//     var validity = false;
//     if(word[0] in rows[0]){
//         for(var check in word){
//             switch(true){
//                 case check in rows[0]:
//                     validity = true
//             }
//         }
//     };
//     if(validity){
//         console.log(`${word} in the same row`)
//     }
//     else{
//         console.log(`${word} not in the same row`)
//     }
// };

// sameRow('chunk')



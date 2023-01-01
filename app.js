const path = require('path');
const express = require('express');
const bp = require('body-parser'); 

const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const errorController = require('./controllers/error');

const mongoDBConnect = require('./helper/db').mongoDBConnect
const app = express();

app.use(bp.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))) //helps access styles statically

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
    User.findbyId("63af3a9564885bb7a6009d91")
        .then(user => {
            // req.user = user 
            // only holds properties of the user from db and not the methods
            req.user = new User(
                user.firstname, user.lastname, user.email, user.cart, user._id
                ) // now we have access to the user methods
            // manually creating a user (from my model) method on request
            // so I can always access user on all requests (see postAddproduct Ctrl)
            next() // this enables to get to the next middleware => adminRoutes
        })
        .catch(err => {
            console.log("Error finding user")
        })
})

app.use('/admin', adminRoutes) //filtering all paths from adminRoutes
app.use(shopRoutes) // its ideal this comes before admin routes though

app.use(errorController.errorPage)

mongoDBConnect(() => {
    app.listen(4000)
})

// always remember the data passed into a post request in a form is available
// via it's input fields and can hence be retrieved via the body using all
// the name tags (see form tag in product-detail.ejs)

// this is not so in a get request, hence the use of params since we simply 
// use a dynamic segment in the href tag (see a tag in product-list.ejs)


// // 1) stonepiles array
// const stonePiles = array => {
//     // stuff 
// }


// DS password => $Uds@11_21


// // to count the number of distinct value pairs such that a+k=b
// //also, elems in a pair can be the same elem in the array
// const countPairs = (int, array) => {
//     for(let i=0; i<array.length; i++){
//         const val = array[i] +  int
//         // val == array[i+1] ? console.log(`elem at index ${i}`) : console.log('next')
//         for(let j=0; j<array.length; j++){
//             // if()
//             val == array[j] ? console.log(`elem at index ${i}`) : ''
//         }
//     }
// }
// countPairs(0, [1, 2])



// easily create an npm project and bypass default stuff
// npm init -y



// leetcode

// const dic = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
// const romanToInt = rom => {
//     const conv = rom.toUpperCase()
//     let sum = 0
//     for(let i = 0; i < conv.length; i++){
//         console.log(conv[i])
//         for(check in dic){

//             if(conv[i] === check){
//                 sum += dic[check]
//                 // console.log(dic[check])
//             }
//             // compare the letter input and that in the dictinary
//             // see if the dictionary value is less than the previos one
//         }
//     }
//     return sum

//     // make sure user string input isn't backwards for addition


//     // ensure user SI when backwards calls for subtraction
// }

// const result = romanToInt('md')
// console.log(result)


// // to convert from roman numeral to integer
// const romanToInt = s => {
//     let sum = 0;
//     let roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
//     for (let i = 0; i < s.length; i++) {
//         roman[s[i]] < roman[s[i + 1]] ? sum -= roman[s[i]] : sum += roman[s[i]];
//     }
//     return sum;
// }
// // const result = romanToInt('XM')
// // console.log(result)



// // to find the longest common prefix string amongst an array of strings and 
// // return an empty string if none exists
// const longestCommonPrefix = arr => {
//     for(let i=0; i<arr[0].length; i++){
//         if(!arr.every(elem => elem[i] === arr[0][i])){
//             return arr[0].slice(0, i)
//         }
//     }
//     return arr[0]
// }
// // const result = longestCommonPrefix(["tderdog","tdsracecar","tdercar"])
// // console.log(result)




// to Merge two lists in a one sorted list, by splicing together the nodes 
// of the first two lists & returning the head of the merged 
// linked list.
// const mergeTwoLists = (list1, list2) => {
//     const linkedList = list1.concat(list2)
//     return linkedList.sort()
// }
// const result = mergeTwoLists([5, 1], [7, 2, 4])


// const mergeTwoLists = (list1, list2) => {
//     if (!list1 || !list2) return list1 || list2; // check for edge cases
//     // let newList = new ListNode();
//     let last = newList;
//     while (list1 && list2) {
//         if (list1.val > list2.val) { 
//             last.next = list2;
//             list2 = list2.next;
//         } else {
//             last.next = list1;
//             list1 = list1.next;
//         }
//         last = last.next;
//     }
//     last.next = list1 || list2; // append remaining list if any
//     return newList.next;
// };
// const result = mergeTwoLists([5, 1], [7, 2, 4])

// const mergeTwoLists = (l1, l2) => {
//     if(!l1 || !l2) return (l1? l1:l2);
//     if(l1.val < l2.val) {
//       l1.next = mergeTwoLists(l1.next, l2);
//       return l1;
//     } else {
//       l2.next = mergeTwoLists(l1, l2.next);
//       return l2;
//     }
//     // return l1 || l2
// };


// const mergeTwoLists = (list1, list2) => {
//     if (list1 == null) return list2;
//     if (list2 == null) return list1;
 
//     if (list1.val < list2.val) {
//     list1.next = mergeTwoLists(list1.next, list2);
//     return list1;
//     }
//     else {
//     list2.next = mergeTwoLists(list1, list2.next);
//     return list2;
//     }
// };
// const result = mergeTwoLists([5, 1], [7, 2, 4])
// console.log(result)



// // to take a sting of words and return the last
// const lengthOfLastWord = word => {
//     let split_word = word.trim().split(" ")
//     let val = split_word[split_word.length - 1].length
//     return val
// };
// const result = lengthOfLastWord('there is power in the tongue')
// console.log(result)


// // to return true if an integer is a palindrome, and false if otherwise.
// // a numerical palindrome remains the same when its digits are reversed. 
// // In other words, it has reflectional symmetry across a vertical axis
// const isPalindrome = int => {
//     let string_x = String(int)
//     let rev_string_x = string_x.split("").reverse().join("")
//     if(rev_string_x === string_x) return true
//     else return false
// };
// const result = isPalindrome(121)
// console.log(result)

// // Given an array of integers and an integer target, return indices of 
// // the two numbers such that they add up to target.
// const twoSum = (num, target) => {
//     arr = []
//     for(let i=0; i<num.length; i++){
//         for(let j=i+1; j<num.length; j++){
//             let val = num[i] + num[j]
//             val === target ? arr.push(i, j) : ''
//         }
//     }
//     return arr
// }
// const result = twoSum([3,2,4,7,1], 5)
// console.log(result)



// // Given a sorted array of distinct integers and a target value, return 
// // the index if the target is found. If not, return the index where it 
// // would be if it were inserted in order.
// // You must write an algorithm with O(log n) runtime complexity.

// const searchInsert = (nums, target) => {
//     let left = 0, right = nums.length - 1;
//     while (left <= right) {
//         if (left === right) return target <= nums[left] ? left : left +1;
//         const mid = left + Math.floor((right - left)/2);
//         if (nums[mid] < target) left = mid + 1;
//          else right = mid;
//     }
// };
// const result = searchInsert([1, 3, 5, 6], 5)
// console.log(result)



// // You are climbing a staircase. It takes n steps to reach the top.
// // Each time you can either climb 1 or 2 steps. In how many distinct 
// // ways can you climb to the top?

// const climbStairs = n => {
//     let one = two = 1
//     for(let i=1;i<n;i++){
//         let temp = one
//         one = one+two
//         two= temp
//     }
//     return one;
// };
// climbStairs()




// // Given an array nums of size n, return the majority element.
// // The majority element is the element that appears more than ⌊n / 2⌋ times. 
// // You may assume that the majority element always exists in the array.

// const majorityElement = nums => {
//     // Boyer-Moore Voting Algorithm
//     let count = 0, maxValue = 0;
//     for(let i=0; i < nums.length; i++){
//         if(count === 0){
//             maxValue = nums[i];
//         }
//         count += nums[i] === maxValue ? 1 : -1;
//     }  
//     return maxValue;
// };




// // You are given a large integer represented as an integer array digits, 
// // where each digits[i] is the ith digit of the integer. The digits are 
// // ordered from most significant to least significant in left-to-right 
// // order. The large integer does not contain any leading 0's.
// // Increment the large integer by one and return the 
// // resulting array of digits.

// const plusOne = dig => {
//     let sum = BigInt(dig.join('')) + 1n
//     return sum.toString().split('')
// }



// const test = '23.45'
// const result = parseFloat(test)
// console.log(result)


var express = require("express")
var app = express();

app.use(express.static(__dirname+ 'public'));
app.use(express.json());
app.use(express.urlencoded({extends: false}));

const addNumbers = (number1, number2) =>{
 var num1 = parseInt(number1);
 var num2 = parseInt(number2);
 var result  = num1+num2;
 return result;
};

app.get("/addTwoNumbers",(req,res) => {
 let { number1, number2 } = req.query;
 let result = addNumbers(number1, number2);
 res.json({ status: 200, data: result, message: 'success'})
})

var port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App listening to http://localhost: "+port)
})  
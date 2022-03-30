
var express=require("express");
var bcrypt = require('bcryptjs');
var jwtDecode = require('jwt-decode');
var bodyParser=require('body-parser');
var jwt= require("jsonwebtoken");
var app = express();
//////////////////////////////////////////////////////////////
var router=express.Router();
var cors = require('cors');
var authenticateController=require('./controllers/authenticate-controller');
process.env.SECRET_KEY="SecretKey";
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var connection = require('./config');
app.post('/api/authenticate',authenticateController.authenticate);
app.use(cors());

app.use(function(req,res,next) {
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
next();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.use(function(req,res,next) {
  try {
    var token=req.headers.token;
    if(token){
      try{
          jwt.verify(token,process.env.SECRET_KEY,function(err,ress){
          let decoded = jwtDecode(token);
          next();
        })
      }
      catch(err){
         res.status(403).json({message: 'Токен недействителен', status:403})
       }
    }
    else{
         res.status(401).json({message: 'Пожалуйста, отправьте токен ', status:401});
    }
  }
  catch(err){
    console.log(err);
    res.status(400).json({'status':400,'message':'Сервер не понимает запрос из-за неверного синтаксиса', 'result':[]});
 } 
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/test', async(req, res) =>{
  try {
   var sql = 'SELECT * FROM Product;';
   connection.query(sql, function (err, result){
     if( err ){
         console.log(err);
         res.status(400).json({'status':400,'message':'Ошибка БД', 'result':[]});
       }
       else{
          if(result.length>0){ 
            res.status(200).json({'status':200,'message':'Выполнено успешно', 'result':result});
          }
          else{
             res.status(404).json({'status':404,'message':'По запросу ничего не найдено', 'result':[]});
          }
       }
    });
 }
 catch(err){
    console.log(err);
    res.status(400).json({'status':400,'message':'Сервер не понимает запрос из-за неверного синтаксиса', 'result':[]});
 }
});

app.listen(3000);

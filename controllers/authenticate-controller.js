var bcrypt = require('bcryptjs');
var jwt=require('jsonwebtoken');
var connection = require('./../config');

module.exports.authenticate=async function(req,res){
  try{
    res.header('Access-Control-Allow-Origin', '*');
    var name = req.body.name;
    var password = req.body.password;
    if((typeof name !== 'undefined')||(typeof password !=='undefined')){
        name = name.replace(/"/g, '\"');
        let sql = "SELECT * FROM Users WHERE Name = ?";  
        connection.query(sql,[name], function (error, results, fields){
        if (err) {
          console.log(err);
          res.status(400).json({'status':400,'message':'Сервер не понимает запрос из-за неверного синтаксиса'});
        }
        else{
            if(results.length >0){
                let hashedPassword  = bcrypt.hashSync(password, results[0].Salt);
                if(hashedPassword==results[0].Password){
                  let token=jwt.sign(results[0].Name,process.env.SECRET_KEY,{expiresIn:'1d'});
                  res.status(200).json({'status':200,'message':'Выполнено успешно','token':token})
                }else{
                    res.status(401).json({'status':401,'message':"Не правильные имя или пароль"});
                }
            }
            else{
              res.status(401).json({'status':401,'message':"Пользователя с таким именем не существует"});
             }
          }
        });
    }
    else{
      res.status(400).json({'status':400,'message':'Сервер не понимает запрос из-за неверного синтаксиса'});
    }
  }
  catch(err){
    console.log(err);
    res.status(400).json({'status':400,'message':'Сервер не понимает запрос из-за неверного синтаксиса'});
  }
}
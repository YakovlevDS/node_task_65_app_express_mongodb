const express = require("express");
const {MongoClient} = require("mongodb");
const {ObjectId} = require("mongodb")
   
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/");
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect((err, client)=>{
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("usersdb").collection("users");
    app.listen(3000, ()=>{
        console.log("Сервер ожидает подключения... ");
    });
});
 
app.get("/api/users",(req, res)=>{
    const collection = req.app.locals.collection;
    collection.find({}).toArray((err, users)=>{
        if(err) return console.log(err);
        res.send(users)
    });
     
});
app.get("/api/users/:id", function(req, res){
    const id = new ObjectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id},(err, user)=>{
               if(err) return console.log(err);
        res.send(user);
    });
});
   
app.post("/api/users", jsonParser,(req, res)=> {
    if(!req.body) return res.sendStatus(400);
    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {name: userName, age: userAge};
    const collection = req.app.locals.collection;
    collection.insertOne(user, (err, result)=>{
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.delete("/api/users/:id", (req, res)=>{
    const id = new ObjectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id},(err, result)=>{
        if(err) return console.log(err);    
        let user = result.value;
        res.send(user);
    });
});
   
app.put("/api/users", jsonParser, (req, res)=>{
    if(!req.body) return res.sendStatus(400);
    const id = new ObjectId(req.body.id);
    const userName = req.body.name;
    const userAge = req.body.age;
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
         {returnDocument: "after" },(err, result)=>{
        if(err) return console.log(err);     
        const user = result.value;
        res.send(user);
    });
});
 
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});





//! код сервера с использованием async/await:


// const express = require("express");
// const MongoClient = require("mongodb").MongoClient;
// const objectId = require("mongodb").ObjectId;
    
// const app = express();
// const jsonParser = express.json();
  
// const mongoClient = new MongoClient("mongodb://localhost:27017/");
 
// app.use(express.static(__dirname + "/public"));
 
 
// (async () => {
//      try {
//         await mongoClient.connect();
//         app.locals.collection = mongoClient.db("usersdb").collection("users");
//         await app.listen(3000);
//         console.log("Сервер ожидает подключения...");
//     }catch(err) {
//         return console.log(err);
//     } 
// })();
 
 
// app.get("/api/users", async(req, res) => {
         
//     const collection = req.app.locals.collection;
//     try{
//         const users = await collection.find({}).toArray();
//         res.send(users);
//     }
//     catch(err){return console.log(err);}
      
// });
// app.get("/api/users/:id", async(req, res) => {
         
//     const id = new objectId(req.params.id);
//     const collection = req.app.locals.collection;
//     try{
//         const user = await collection.findOne({_id: id});
//         res.send(user);
//     }
//     catch(err){return console.log(err);}
// });
    
// app.post("/api/users", jsonParser, async(req, res)=> {
        
//     if(!req.body) return res.sendStatus(400);
        
//     const userName = req.body.name;
//     const userAge = req.body.age;
//     let user = {name: userName, age: userAge};
        
//     const collection = req.app.locals.collection;
     
//     try{
//         await collection.insertOne(user);
//         res.send(user);
//     }
//     catch(err){return console.log(err);}
// });
     
// app.delete("/api/users/:id", async(req, res)=>{
         
//     const id = new objectId(req.params.id);
//     const collection = req.app.locals.collection;
//     try{
//         const result = await collection.findOneAndDelete({_id: id});
//         const user = result.value;
//         res.send(user);
//     }
//     catch(err){return console.log(err);}
// });
    
// app.put("/api/users", jsonParser, async(req, res)=>{
         
//     if(!req.body) return res.sendStatus(400);
//     const id = new objectId(req.body.id);
//     const userName = req.body.name;
//     const userAge = req.body.age;
        
//     const collection = req.app.locals.collection;
//     try{
//         const result = await collection.findOneAndUpdate({_id: id}, { $set: {age: userAge, name: userName}},
//          {returnDocument: "after" });
//         const user = result.value;
//         res.send(user);
//     }
//     catch(err){return console.log(err);}
// });
  
// // прослушиваем прерывание работы программы (ctrl-c)
// process.on("SIGINT", async() => {
     
//     await mongoClient.close();
//     console.log("Приложение завершило работу");
//     process.exit();
// });
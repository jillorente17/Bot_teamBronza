var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:7912312jose@cluster0.2nwfn.mongodb.net/teamBronza_db?retryWrites=true&w=majority";
var client = new MongoClient(url,{useUnifiedTopology: true, useNewUrlParser: true});

// MongoClient.connect('mongodb://localhost', function (err, client) {
//   if (err) throw err;

//   var db = client.db('mytestingdb');

//   db.collection('customers').findOne({}, function (findErr, result) {
//     if (findErr) throw findErr;
//     console.log(result.name);
//     client.close();
//   });
// }); 
var db = client.db("teamBronza_db");
module.exports.insertData = async function(date,name,city,summoner){
    
    client.connect(function(err){
        if(err){
            console.log("ocurrió un error",err)
        }else{
            console.log("connected");
            db.collection("teamBronza").insertOne({
            "Date": date,
            "Name": name,
            "City": city,
            "Summoner": summoner
        })

    console.log(`Datos insertados: ${name},${date},${city},${summoner}`);
    client.close();
}
    });
};




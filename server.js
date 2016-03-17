var PORT = 3001;

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

//image dir
var main_dir = "img";


var webpage1 = fs.readFileSync('index.html', 'utf-8');

var server = http.createServer(function (request, response) {
    var p = url.parse(request.url, true);
    console.log(p.pathname);
    if(p.pathname=='/search' && p.query.text){
        response.writeHead(200,{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"});
        
        if(p.query.text.includes(':') && p.query.text.includes('{') && p.query.text.includes('}')){
            mongoQuery(p.query.text,response);
            console.log(p.query.text);
        }
        else
            search(p.query.text,response);//this is array of object
        //response.end(JSON.stringify(rtnArray)); //output obj_array and process at front-end
        //response.end(JSON.stringify({data:'hello world '+ rtn})); //basic example
        return;
    }

    if(p.pathname=='/'){
        response.writeHead(200,{"Content-Type":"text/html"});
        response.end(webpage1);
        return;
    }

    response.end('Error!');
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

function mongodb_search(mongoQuery,response){
    // Retrieve
    var MongoClient = require('mongodb').MongoClient;
    // Connect to the db
    //var rtnn = [];
    MongoClient.connect("mongodb://localhost:27017/element_data", function(err, db) {
        if(!err) {
        //console.log("We are connected");
        }
        //get the collection
        var collection = db.collection('clickable_element_table');

        //get the sample query
        //console.log(mongoQuery);
        var query = mongoQuery;//{$or:[{"classname": /com.snapchat.android.discover.ui.adasda/i}, {"id":/com.snapchat.android:id\/channel_view/i}]}; //case insensitive in query reg + i
        //var query = {"classname": /com.snapchat.android.discover.ui/i, "id":/snapchat.android:id\/channel_view/i}; //case insensitive in query reg + i
        
        var a = collection.find(query).limit(1000).toArray(function(err, result){
            if(err){
                console.log('Err' + err);
                return;
            }
            console.log(result); //output the whole output in console
            response.end(JSON.stringify(result));//return to front-end
        });
        return a;
    });   
}

function testIni(queryTest){
    return queryTest + "+ kkkkkkkkk";
}

function testResultDisplay(){
    var a = {classname:'android.support.v7.widget.AppCompatButton', id:'com.tumblr:id/login_button', text:'Log in'};
    var b = {classname:'android.support.v7.widget.Toolbar', id:'com.pinterest:id/actionbar_internal', text:''};
    var objArray = [];
    objArray.push(a);
    objArray.push(b);
    console.log(objArray);
    return objArray;
}

function search(query,response){
    var inputquery = query;
    var outputquery = '';
    //separate the query
    var t = inputquery.split(' ');//splic by space
    var a = new Array();//queryArr
    var q = '';
    var q_final = {};

    var c = new Array();//clicked
    var haha1 = {};

    var temp = [];
    for (var i = 0; i < t.length; i++){
        var haha = {"$or":[
                    {'classname':{ "$regex": t[i], "$options": "i" }}, 
                    {'id':{ "$regex": t[i], "$options": "i" }}, 
                    {'text':{ "$regex": t[i], "$options": "i" }}
                    ]};
       // haha = {'$or':[haha]};  // {$or:[ {"classname": /a/i}, {"id":/b/i}, {"text":/c/i} ]}, 
        temp.push(haha);
        console.log("Or Query: " + temp);
    }
    
    temp = {'$and': temp };  // {$and:[{$or:[{},{},{}]}, {$or:[{},{},{}]}, {$or:[{},{},{}]},]}

    console.log("And Query" + temp);
    mongodb_search(temp,response); //outputquery
}

function mongoQuery(query,response){
    console.log("sssss");
    //var str = "{ hello: 'world', places: ['Africa', 'America', 'Asia', 'Australia'] }";
    var json = JSON.stringify(eval("(" + query + ")"));
    console.log(json);
    mongodb_search(json,response); //outputquery
}


function login(inputquery){


}
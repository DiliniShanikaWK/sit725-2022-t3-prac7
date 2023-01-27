var express = require("express");
var app = express();
var cors = require("cors");
var projectCollection;
let http = require("http").createServer(app);
let io = require("socket.io")(http);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/addTwoNumbers/:firstNumber/:secondNumber", function (req, res, next) {
  var firstNumber = parseInt(req.params.firstNumber);
  var secondNumber = parseInt(req.params.secondNumber);
  var result = firstNumber + secondNumber || null;
  if (result == null) {
    res.json({ result: result, statusCode: 400 }).status(400);
  } else {
    res.json({ result: result, statusCode: 200 }).status(200);
  }
});

/*app.get("/addTwoStrings/:firstName/:secondName", function (req, res, next) {
  var firstName = parseString(req.params.firstName);
  var secondName = parseString(req.params.secondName);
  var result = firstName + secondName || null;
  if (result == null) {
    res.json({ result: result, statusCode: 400 }).status(400);
  } else {
    res.json({ result: result, statusCode: 200 }).status(200);
  }
});*/

app.get("/addTwoStrings/:firstName/:secondName", function (req, res, next) {
  var firstName = req.params.firstName;
  var secondName = req.params.secondName;
  var result = firstName + secondName || null;
  if (result == null) {
    res.json({ result: result, statusCode: 400 }).status(400);
  } else {
    res.json({ result: result, statusCode: 200 }).status(200);
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 10));
  }, 1000);
});

//mongodb connection
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://dilini:123@cluster0.unuv0e9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const createCollection = (collectionName) => {
  client.connect((err, db) => {
    projectCollection = client.db().collection(collectionName);
    //console.log(projectCollection);
    if (!err) {
      console.log("MongoDb Connected Successfully");
    } else {
      console.log("DB Error : ", err);
      process.exit(1);
    }
  });
};

//insert project
const insertProjects = (project, callback) => {
  projectCollection.insert(project, callback);
};

//post api
app.post("/api/projects", (req, res) => {
  console.log("New Project Added", req.body);
  var newProject = req.body;
  insertProjects(newProject, (err, result) => {
    if (err) {
      res.json({ ststusCode: 400, message: err });
    } else {
      res.json({
        statusCode: 200,
        message: "Project successfully added",
        data: result,
      });
    }
  });
});

// get project...
const getProjects = (callback) => {
  projectCollection.find({}).toArray(callback);
};

app.get("/api/projects", (req, res) => {
  getProjects((err, result) => {
    if (err) {
      res.json({ ststusCode: 400, message: err });
    } else {
      res.json({ statusCode: 200, message: "Success", data: result });
    }
  });
});

var port = process.env.port || 3000;

http.listen(port, () => {
  console.log("App listening to http://localhost: " + port);
  createCollection("Cars");
});

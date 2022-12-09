var express = require("express");
var app = express();
var cors = require("cors");
var projectCollection;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

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

app.listen(port, () => {
  console.log("App listening to http://localhost: " + port);
  createCollection("Cars");
});

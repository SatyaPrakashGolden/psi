const express = require('express');
let {authenticateAdmin}=require('./src/app/middlewares/authenticateAdmin')
const app = express();
require('dotenv').config();
const cors = require("cors");
const routes = require("./route");  
const db = require('./src/app/db/mongoose');  
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
var admin = require("firebase-admin");

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});



var serviceAccount = require("./satya-cc4d3-firebase-adminsdk-xma0p-5bbcaebd89.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.set('socketio', io);
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));





app.post('/api/admin/pushNotification', authenticateAdmin ,async (req, res) => {
  const { deviceToken, title, body } = req.body;

  if (!deviceToken || !title || !body) {
      return res.status(400).send({ success: false, message: "Missing required fields: deviceToken, title, or body" });
  }

  const message = {
      token: deviceToken,
      notification: {
          title: title,
          body: body,
      },
  };

  try {
      const response = await admin.messaging().send(message);
      console.log("Notification sent successfully:", response);
      return res.status(200).send({ success: true, message: "Notification sent successfully", response });
  } catch (error) {
      console.error("Error sending notification:", error.message);
      return res.status(500).send({ success: false, message: "Error sending notification", error: error.message });
  }
});

const port = process.env.PORT || 5764;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());



  

routes.forEach(route => {
    app.use(route.path, route.handler);
});
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

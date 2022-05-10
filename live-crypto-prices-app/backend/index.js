require("dotenv").config();
const express = require("express");
const socketIO = require("socket.io");
const axios = require("axios");

const app = express();

app.use(express.json())

//server
const server = app.listen(process.env.PORT, () => {
  console.log(`listening to port ${process.env.PORT}`);
});

//sockethandler
const socketHandler = socketIO(server);

//sockethandler after connection, if connected, disconnected or error
socketHandler.on("connection", (socket) => {
  socket.on("connection_error", () => {
    console.log("Connection Error");
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnect");
  });

  console.log("Client Connected");
  socket.emit("crypto", "Hello Crypto Client ! again ");
});


//fetching data using axios
const getPrices = () =>
  axios
    .get(process.env.LIST_URL, {
      headers: {
        "x-messari-api-key": process.env.API_KEY,
      },
    })
    .then((response) => {
      const priceList = response.data.data.map((item) => {
        return {
          id: item.id,
          name: item.symbol,
          price: item.metrics.market_data.price_usd,
        };
      });
      socketHandler.emit("crypto", priceList);

      console.log(priceList);
    })
    .catch((err) => {
      //if got any error, then
      console.log(err);
      socketHandler.emit("crypto", {
        error: true,
        message: "Error Fetching Prices Data from API",
      });
    });

//fetching every one second
setInterval(() => {
  getPrices();
}, 1000);



//for profile
app.get('/cryptos/profile',(req,res)=>{
  req.json({error:true,message:'Missing Crypto ID in URL'})
})


//dynamic variable :id for getting id
app.get("/cryptos/profile/:id", (req, res) => {
  const cryptoID = req.params.id;
  if (!cryptoID) {
    res.json({ error: true, message: "Missing Crypto ID in the API URL" });
  } 
  axios
    .get(`${process.env.BASE_URL_V2}/${cryptoID}/profile`, {
      headers: {
        "x-messari-api-key": process.env.API_KEY,
      },
    })
    .then((responseData) => {

      res.json(responseData.data.data);

    })
    .catch((err) => {
      res.json("crypto", {
        error: true,
        message: "Error Fetching Prices Data from API",
        errorDetails: err,
      });
    });
 
});


//for market-data
app.get('/cryptos/market-data',(req,res)=>{
  req.json({error:true,message:'Missing Crypto ID in URL'})
})


//dynamic variable :id for getting id
app.get("/cryptos/market-data/:id", (req, res) => {
  const cryptoID = req.params.id;
 
  axios
    .get(`${process.env.BASE_URL_V1}/${cryptoID}/metrics/market-data`, {
      headers: {
        "x-messari-api-key": process.env.API_KEY,
      },
    })
    .then((responseData) => {

      res.json(responseData.data.data);

    })
    .catch((err) => {
      res.json("crypto", {
        error: true,
        message: "Error Fetching Prices Data from API",
        errorDetails: err,
      });
    });
 
});

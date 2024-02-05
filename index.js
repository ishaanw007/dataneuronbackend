const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Component = require('./models/components'); 
const Stats = require('./models/count'); 
const app = express();
const port = 5000;
var cors = require('cors')


app.use(bodyParser.json());
const corsOptions ={
    origin:'*', 
    credentials:true,           
    optionSuccessStatus:200
  }
app.use(cors(corsOptions));
mongoose.connect('mongodb://localhost:27017/resizable_layout').then(function () {
    console.log("DB_connected");
  })
  .catch(function (err) {
    console.log("error", err);
  });



  app.get('/api/fetch', async (req, res) => {
    try {
      // Fetch data for all components
      const allData = await Component.find();
  
      res.json({ success: true, data: allData });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.post('/api/add', async (req, res) => {
    try {
      const { componentId, data } = req.body;
  
      if (![1, 2, 3].includes(componentId)) {
        return res.status(400).json({ error: 'Invalid componentId' });
      }
  
      // Check if data already exists for the given componentId
      const existingData = await Component.findOne({ componentId });
  
      if (existingData) {
        return res.status(400).json({ error: 'Data already added. Please update instead.' });
      }
  
      await Component.create({ componentId, data });
  
      const stats = await Stats.findOneAndUpdate(
        {},
        { $inc: { addCount: 1 } },
        { upsert: true, new: true }
      );
  
      res.json({ success: true, addCount: stats.addCount, updateCount: stats.updateCount });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.post('/api/update', async (req, res) => {
    try {
      const {componentId, data } = req.body;
      if (![1,2,3].includes(componentId)) {
        return res.status(400).json({ error: 'Invalid componentId' });
      }
  
      let curr=await Component.findOneAndUpdate({ componentId: componentId },
        { data: data },
        { new: true } 

        );
        if(curr==null){
            return res.status(404).json({ error: 'First add component data' });


        }

  
      const stats = await Stats.findOneAndUpdate(
        {},
        { $inc: { updateCount: 1 } },
        { upsert: true, new: true }
      );
  
      res.json({ success: true, addCount: stats.addCount, updateCount: stats.updateCount });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await Stats.findOne();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

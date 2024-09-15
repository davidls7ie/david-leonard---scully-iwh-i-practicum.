// required modules
const express = require('express'); 
const axios = require('axios');
const app = express();

// app settings
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// globals 
require('dotenv').config();

// auth key - environment variable
const PRIVATE_APP_ACCESS = process.env.PRIVATE_ACCESS_TOKEN;

// TODO: ROUTE 1 - 
// Create a new app.get route for the homepage to call your custom object data. 
// Pass this data along to the front-end and create a new pug template in the views folder.

// HTTP request 
app.get('/', async (req, res) => {
  
  const services = 'https://api.hubapi.com/crm/v3/objects/2-34405873';

  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  }

  try {
      const resp = await axios.get(services, { headers });
      const data = resp.data.results;
      const object_record_ids = []
      
      // Push data for each object in to the empty array 
      // - useful for BATCHing but not required here. 
      data.forEach(record => {
        object_record_ids.push(record.id);
      });
      const promise_fetch = []
      // Empty Array for fetched IDs 
      const object_record_data = []
      // loop to grab IDs and run the Axios fetch request
      for(i=0; i < object_record_ids.length; i++ ){    
        // Create a variable that runs the API with the correct ID and properties
        const object_fetch = "https://api.hubapi.com/crm/v3/objects/2-34405873/" + object_record_ids[i] + "?properties=service_description,name,marketing_service_name"
        
        // Add the fetch result to the results array 
        object_record_data.push(object_fetch)
        // Use Axios to get the URL from Object Fetch 
        promise_fetch.push(
          axios.get(object_fetch, { headers })
              .then(response => response.data,
              )
              .catch(error => {
                  console.error('Error fetching data for ID: ' + object_record_ids[i], error);
                  return null; // Handle or log error as required
              }),
              console.log("Recieved data for " + object_record_ids[i]),
              console.log(promise_fetch[i]),
      );
      }
      console.log("The completed array with the request URLS")
      console.log(object_record_data)
      console.log("The completed array with the objects")
      console.log(promise_fetch[i])

    // Render Template 
      res.render('index', { title: 'Practicum Homepage | HubSpot APIs', data });     

  } catch (error) {
      console.error(error);
  }

});

// TODO: ROUTE 2 - 
// Create a new app.get route for the form to create or update new custom object data. 
// Send this data along in the next route.

app.get('/update-contact', (req, res) => {
    var title = 'Update Custom Object Form | Integrating With HubSpot I Practicum.'

    res.render('updates', { 
        title: 'Add a Contact | Integrating With HubSpot I Practicum' ,
        my_message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    });

  })


  app.get('/update-service', (req, res) => {
    var title = 'Update Custom Object Form | Integrating With HubSpot I Practicum.'

    res.render('update-service', { 
        title: 'Add a Service | Integrating With HubSpot I Practicum' ,
    });

  })

// TODO: ROUTE 3 - 
// Create a new app.post route for the custom objects form to create
// or update your custom object data. 
// Once executed, redirect the user to the homepage.
// needs async / await, promise to pass data from form to CRM

app.post('/add-service', async (req, res) => {
    
  const { name, 
          marketing_service_name, 
          service_description
        } = req.body;

  const cobject_data = {
    
      "properties": {
        "name": req.body.name,
        "marketing_service_name" : req.body.marketing_service_name,
        "service_description" : req.body.service_description
      }
  };
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post('https://api.hubapi.com/crm/v3/objects/2-34405873', cobject_data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Something went wrong:', error);
    res.status(500).send('Something went wrong.');
  }
});  


// For adding Contacts to the CRM 

app.post('/add', async (req, res) => {
    
    const { firstname, lastname, email } = req.body;
  
    const contact_data = {
      properties: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      }
    };
  
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };
  
    // update the query string to take new values - 19:40 
    try {
      const response = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', contact_data, { headers });
      res.redirect('/');
    } catch (error) {
      console.error('Something went wrong:', error);
      res.status(500).send('Something went wrong.');
    }
  });  


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
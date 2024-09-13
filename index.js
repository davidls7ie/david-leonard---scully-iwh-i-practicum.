const express = require('express'); 
const axios = require('axios');
const app = express();
/* - pass along ? 
    var update_title = 'Update Custom Object Form | Integrating With HubSpot I Practicum.'
*/
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// globals 
require('dotenv').config();

// Auth Key

const PRIVATE_APP_ACCESS = process.env.PRIVATE_ACCESS_TOKEN;

// Route 0 - Example code  / Works as expected


// TODO: ROUTE 1 - 
// Create a new app.get route for the homepage to call your custom object data. 
// Pass this data along to the front-end and create a new pug template in the views folder.


app.get('/', async (req, res) => {
  const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  }

  try {
      const resp = await axios.get(contacts, { headers });
      const data = resp.data.results;
      res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
  } catch (error) {
      console.error(error);
  }

});


// TODO: ROUTE 2 - 
// Create a new app.get route for the form to create or update new custom object data. 
// Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    var title = 'Update Custom Object Form | Integrating With HubSpot I Practicum.'

    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' ,
        my_message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies eros vel dui sagittis convallis. Proin vestibulum sapien sem, et dictum justo ultricies et',
    });

  })

  // app.get('/cobject', (req, res) => {
  //   res.render('updates', { 
  //       title: 'List Objects| Integrating With HubSpot I Practicum' ,
  //       my_message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies eros vel dui sagittis convallis. Proin vestibulum sapien sem, et dictum justo ultricies et',
  //   });

  // })

  https://app.hubspot.com/contacts/<test-account-id>/objects/<custom-object-id>/views/all/list

// TODO: ROUTE 3 - 
// Create a new app.post route for the custom objects form to create
// or update your custom object data. 
// Once executed, redirect the user to the homepage.
// needs async / await, promise to pass data from form to CRM
app.post('/add', async (req, res) => {
    
    const { firstname, lastname, email } = req.body;
  
    const cobject_data = {
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
      const response = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', cobject_data, { headers });
      res.redirect('/');
    } catch (error) {
      console.error('Something went wrong:', error);
      res.status(500).send('Something went wrong.');
    }
  });    

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
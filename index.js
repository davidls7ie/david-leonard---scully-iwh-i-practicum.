/* This is to test the git forking Not Found Error
npm list -g 
*/

// globals 
require('dotenv').config();

// packages
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

// Auth Key

const PRIVATE_APP_ACCESS = process.env.PRIVATE_ACCESS_TOKEN;

// Route 0 - Example code 

app.get('/contacts', async (req, res) => {

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

// TODO: ROUTE 1 - 
// Create a new app.get route for the homepage to call your custom object data. 
// Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', (req, res) => {

    res.render('index', { 
        title: 'Home | Integrating With HubSpot I Practicum' ,
        my_message: 'Welcome home',
    });
  })

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

// TODO: ROUTE 3 - 
// Create a new app.post route for the custom objects form to create
// or update your custom object data. 
// Once executed, redirect the user to the homepage.

// needs async / await, promise to pass data 
app.post('/update-cobj',  async (req, res) => {

    const { name, email } = req.body;
    
    // Headers Object
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

  })
  

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
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

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
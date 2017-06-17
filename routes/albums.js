//*****************************************************************************
// Route implementations for the album database maintenance application
//
// Contains:
//  /getAlbumList   - Reads the list of albums from the database and returns them as a JSON object
//  /newAlbum       - Renders the blank form for submitting a new album
//  /addAlbum       - Inserts the new album submitted from the form into the database
//  /getAlbum/:id   - Reads the selected album record from the database and renders it into the update form
//  /updateAlbum    - Updates the album record with data submitted from the update form
//  /deleteAlbum/:id- Deletes the selected album record from the database
//*****************************************************************************
var express = require('express');
var router = express.Router();

//*****************************************************************************
// Retrieve  the list of all albums from the database and return them in the
// result as a JSON  object
//*****************************************************************************
router.get('/getAlbumList', getAlbumList);      // Route, completion callback function

function getAlbumList(req, res)
{
    var collection = req.db.get('AlbumList');   // Mongo collection name
    collection.find({}, {}, findComplete);      // search criteria, completion callback function

    function findComplete(error, docs)
    {
        if (error) {
            res.send('There was a problem reading records from the database')
        } else {
            res.json(docs);
        }
    }
}

//*****************************************************************************
// Functions for adding Records
//*****************************************************************************
//*********************************************************
// Get the page to collect fields for the new album
//*********************************************************
router.get('/newAlbum', newAlbum);                          // Route, completion callback function

function newAlbum(req, res)
{
    res.render('newalbum',                                  // Base name of jade/pug filename to use in view
        { title : 'Add a new album to your collection' }    // Javascript object containing the fields to be accessed by the view
    );
}

//*********************************************************
// Post a new album into the database
//*********************************************************
router.post('/addAlbum', addAlbum);             // Route, completion callback function

function addAlbum(req, res)
{
    var albumName   = req.body.albumname;
    var artist      = req.body.artist;
    var year        = req.body.year;
    var genre       = req.body.genre;

    var collection = req.db.get('AlbumList');   // Mongo collection name
    collection.insert({                         // Javascript object containing the fields to be stored
        albumname : albumName,
        artist : artist,
        year : year,
        genre : genre
    }, onInsertComplete);                       // Completion callback function

    function onInsertComplete(error, docs)
    {
        if (error) {
            res.send('There was a problem adding the album to the database')
        } else {
            res.redirect('/index');             // Route indicating where to go next
        }
    }
}

//*****************************************************************************
// Functions for updating existing records
//*****************************************************************************
//*********************************************************
// Read the record with the given id from the database and
// render it onto the screen
//*********************************************************
router.get('/getAlbum/:id', getAlbum);              // Route, callback function

function getAlbum(req, res)
{
    var albumToRetrieve = req.params.id;            // Get the id of the album requested to be updated

    var collection = req.db.get('AlbumList');       // Mongo collection name
    var cursor = collection.find({'_id' : albumToRetrieve}, {}, onFindComplete);    // Search criteria, completion callback function

    function onFindComplete(error, docs)
    {
        if (error) {
            res.send('Problem reading the album to be updated from the database');
        } else {
            res.render('updatealbum',               // Base name of jade/pug filename to use in view
                {                                   // Javascript object containing the fields to be accessed by the view
                    title : 'Update this album',    // Name must match variable name within the jade/pug file
                    album : docs[0]                 // docs is array of 1 mongo record with field names already installed
                }
            );
        }
    }
}

//*********************************************************
// Post an update to the album data (because browsers don't
// seem to support 'PUT')
//*********************************************************
router.post('/updateAlbum', updateAlbum);       // Route, completion callback function

function updateAlbum(req, res)                  // Route, callback function
{
    var id          = req.body._id;
    var albumName   = req.body.albumname;
    var artist      = req.body.artist;
    var year        = req.body.year;
    var genre       = req.body.genre;

    var collection = req.db.get('AlbumList');   // Mongo collection name
    collection.update({_id : id},               // Search criteria
        {                                       // Javascript object containing new values for the record in the database
            albumname   : albumName,
            artist      : artist,
            year        : year,
            genre       : genre
        }, onUpdateComplete                     // Completion callback function
    );

    function onUpdateComplete(error, docs)
    {
        if (error) {
            res.send('There was a problem updating the album in the database')
        } else {
            res.redirect('/index');             // Route indicating where to go next
        }
    }
}


//*****************************************************************************
// Functions for deleting existing records
//*****************************************************************************
//*********************************************************
// Delete the record with the given ID from the database
// and then render the updated album list onto the screen
//*********************************************************
router.get('/deleteAlbum/:id', deleteAlbum);                    // Route, callback function

function deleteAlbum(req, res)
{
    var albumToDelete = req.params.id;                          // Get the id of the album requested to be deleted

    var collection = req.db.get('AlbumList');                   // Mongo collection name
    var cursor = collection.remove({'_id' : albumToDelete});    // Search criteria
    res.redirect('/index');
}

module.exports = router;

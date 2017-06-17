//*****************************************************************************
// Index route implementations for the album database maintenance application
//
// Contains:
//  / - Renders the page for listing the albums.  Actual data gets filled in
//      by javascript on the client side.
//*****************************************************************************
var express = require('express');
var router = express.Router();

// Get album list page
router.get('/', displayAlbumList);

function displayAlbumList(req, res)
{
    var collection = req.db.get('AlbumList');   // Mongo collection name
    collection.find({},{}, onFindComplete);     // Search criteria, completion callback function

    function onFindComplete(error, docs)
    {
        if (error) {
            res.send('Problem encountered while attempting to read the album list from the database')
        } else {
            res.render('albumlist',                 // Base name of jade/pug filename to use in view
                {                                   // Javascript object containing the fields to be accessed by the view
                    'title' : 'Here are your albums'
                }
            );
        }
    }
}

module.exports = router;

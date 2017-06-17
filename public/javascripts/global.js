//*****************************************************************************
// Client-side javascript for manipulating the generated HTML
//*****************************************************************************
$(onLoad);

function onLoad()
{
    populateTable();

    $('#albumList table tbody').on('click', 'td a.linkdeletealbum', deleteAlbum);   // Delete is intercepted so we can pop up a confirmation
}

//*****************************************************************************
// Get the list of records from the server and place each one into the HTML
// table.
//*****************************************************************************
function populateTable() {
    var tableContent = '';

    // Get the list of albums from the server
    $.getJSON('/albums/getAlbumList', unpackList);  // Async call.  Callback happens after data arrives from network

    function unpackList(data) {                     // Callback function called after data arrives
        $.each(data, unpackItem);                   // Add each individual record into the table data
        $('#albumList table tbody').html(tableContent); // Must be done here so that data is populated beforehand
    }

    // Fill the table with database fields, and for each row create an update and a delete link
    function unpackItem() {
        tableContent += '<tr>';
        tableContent += '<td>' + this.albumname + '</td>';
        tableContent += '<td>' + this.artist + '</td>';
        tableContent += '<td>' + this.year + '</td>';
        tableContent += '<td>' + this.genre + '</td>';
        tableContent += '<td><a href="albums/getAlbum/' + this._id + '" class="linkupdatealbum" rel="' + this._id + '">update</a></td>';

        // Note albumname added as an attribute below... allows name
        // confirmation on delete without re-reading the record from the server
        tableContent += '<td><a href="#" albumname="' + this.albumname + '" class="linkdeletealbum" rel="' + this._id + '">delete</a></td>';
        tableContent += "</tr>";
    }
}

//*****************************************************************************
// Confirm that it is really desired to delete the selected row
//
// Note that albumname was added to the table data object that was clicked
// in the code above.  So the name can be displayed here without having to
// read the record from the server again.
//*****************************************************************************
function deleteAlbum(event) {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete "' + $(this).attr('albumname') + '"?');
    var nextUrl = '';
    if (confirmation === true) {
        nextUrl = 'albums/deleteAlbum/' + $(this).attr('rel');  // Confirmed... off to do the actual deletion on the server
    } else {
        nextUrl = '/index';                                     // Denied... go back to the main list
    }
    window.location.replace(nextUrl);
}

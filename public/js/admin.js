var tilRecord; //for TIL API object

function init() {
    getTILJSON();
}

function getTILJSON() {
    jQuery.ajax({
        url: '/api/get',
        dataType: 'json',
        success: function(response) {
            tilRecord = response.record;
            loadAll();
        }
    })
}

function loadAll() {
    jQuery('#all-records').empty();
    for (var i = 0; i < tilRecord.length; i++) {
        var date = new Date(tilRecord[i].dateAdded); // turn string into a date object
        var htmlToAdd = '<div id="admin-entry">' +
            '<h4><span class ="dateConverted">' + date.toDateString() + '</span></h4>' + //translated date
            '<h1><span class ="dateAdded">' + tilRecord[i].dateAdded + '</span></h1>' + //og date - needed to edit
            '<p>Today I learned: <span class="til">' + tilRecord[i].til + '</span></p>' +
            '<p>Context: <span class="context">' + tilRecord[i].context + '</span></p>' +
            '<p>Best Parts Of The Day: <span class="bestPartDay">' + tilRecord[i].bestPartDay + '</span></p>' +
            '<p>Tags: <span class="tags">' + tilRecord[i].tags + '</span></p>' +
            '<p>Name: <span class="name">' + tilRecord[i].name + '</span></p>' +
            '<p class="hide">ID: <span class="id">' + tilRecord[i]._id + '</span></p>' +
            '<button type="button" class="edit-button" id="' + tilRecord[i]._id + '" onclick="deleteRecord(event)">Delete Record</button>' +
            '<button type="button" class="edit-button" data-toggle="modal" data-target="#editModal"">Edit Record</button>' +
            '</div>';
        jQuery("#all-records").append(htmlToAdd);
    }
}

//GETS THE DATA FROM THE RENDERED HTML ENTRY
jQuery('#editModal').on('show.bs.modal', function(e) {
    // let's get access to what we just clicked on
    var clickedButton = e.relatedTarget;
    var parent = jQuery(clickedButton).parent();

    //get values of records to edit by targeting spans within parent and grabbing text
    var til = $(parent).find('.til').text();
    var context = $(parent).find('.context').text();
    var bestPartDay = $(parent).find('.bestPartDay').text();
    var tags = $(parent).find('.tags').text();
    var name = $(parent).find('.name').text();
    var id = $(parent).find('.id').text();
    var dateAdded = $(parent).find('.dateAdded').text(); //original
    // var dateConverted = $(parent).find('.dateConverted').text(); //ISO 8601

    console.log("modal dateAdded raw: " + dateAdded);

    //POPULATES IN FORM FROM ABOVE VARIABLES
    jQuery("#edit-date").val(dateAdded);
    jQuery("#edit-til").val(til);
    jQuery("#edit-context").val(context);
    jQuery("#edit-bestPartDay").val(bestPartDay);
    jQuery("#edit-tags").val(tags);
    jQuery("#edit-name").val(name);
    jQuery("#edit-id").val(id);

    jQuery("#edit-dateAdded").val(dateAdded); //set the field in the modal

})

function deleteRecord(event) {
    var targetedId = event.target.id;
    console.log('the record to delete is ' + targetedId);
    // now, let's call the delete route with AJAX
    jQuery.ajax({
        url: '/api/delete/' + targetedId,
        dataType: 'json',
        success: function(response) {
            // now, let's re-render the records
            getTILJSON();
        }
    })
    event.preventDefault();
}

//POST EVENT
jQuery("#editForm").submit(function(e) {

    // first, let's pull out all the values
    var til = jQuery("#edit-til").val();
    var context = jQuery("#edit-context").val();
    var bestPartDay = jQuery("#edit-bestPartDay").val();
    var tags = jQuery("#edit-tags").val();
    var name = jQuery("#edit-name").val(); //new
    var id = jQuery("#edit-id").val();
    var stringDate = jQuery("#edit-dateAdded").val();
    var dateAdded = new Date(stringDate) // Mon Sep 19 2011 08:49:21 GMT-0700 (PDT)
    console.log("date object: " + dateAdded)

    // POST the data from above to our API create route
    jQuery.ajax({
        url: '/api/update/' + id,
        dataType: 'json',
        type: 'POST',
        data: {
            til: til,
            context: context,
            bestPartDay: bestPartDay,
            tags: tags,
            name: name,
            dateAdded: dateAdded //new
        },
        success: function(response) {
            if (response.status == "OK") {
                console.log("SUCCESS")
                getTILJSON(); // re-render the records
                $('#editModal').modal('hide') // now, close the modal
                jQuery("#editForm input").val(''); // now, clear the input fields
            } else {
                alert("something went wrong with edit 1");
            }
        },
        error: function(err) {
            alert("something went wrong with edit 2"); // do error checking
            console.error(err);
        }
    });
    // prevents the form from submitting normally
    e.preventDefault();
    return false;
});

window.addEventListener('load', init())

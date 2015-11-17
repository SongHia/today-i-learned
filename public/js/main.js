function init() {
  renderRecord();
}

// edit form button event
// when the form is submitted (with a new record edit), the below runs
jQuery("#editForm").submit(function(e){

	// first, let's pull out all the values
	// the name form field value
	var til = jQuery("#edit-til").val();
	var context = jQuery("#edit-context").val();
	var bestPartDay = jQuery("#edit-bestPartDay").val();
	var tags = jQuery("#edit-tags").val();
	var id = jQuery("#edit-id").val();
     
  console.log(id);
      
	// POST the data from above to our API create route
  jQuery.ajax({
  	url : '/api/update/'+id,
  	dataType : 'json',
  	type : 'POST',
  	// we send the data in a data object (with key/value pairs)
  	data : {
  		til : til,
  		context : context,
  		bestPartDay : bestPartDay,
  		tags : tags
  	},
  	success : function(response){
  		if(response.status=="OK"){
	  		// success
	  		console.log(response);
	  		// re-render the records
	  		renderRecord();
	  		// now, close the modal
	  		$('#editModal').modal('hide')
	  		// now, clear the input fields
	  		jQuery("#editForm input").val('');
  		}
  		else {
  			alert("something went wrong with edit 1");
  		}
  	},
  	error : function(err){
  		// do error checking
  		alert("something went wrong with edit 2");
  		console.error(err);
  	}
  }); 

	// prevents the form from submitting normally
  e.preventDefault();
  return false;
});


// get Record JSON from /api/get
function renderRecord(){
	// first, make sure the #record-holder is empty
	jQuery('#record-holder').empty();

	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {
			console.log(response);

			var record = response.record;

			for(var i=0;i<record.length;i++){
				//turn string into a date object
				var date =  new Date(record[i].dateAdded);

				var htmlToAdd = '<div class="col-md-4">'+
					// '<img src='+record[i].imageUrl+' width="100">'+
					'<h1>'+date.toDateString()+'</h1>'+
					'<h1>Today I learned: '+record[i].til+'</h1>'+
					'<ul>'+
						'<li>Context: '+record[i].context+'</li>'+
						'<li>Best Part Of The Day: '+record[i].bestPartDay+'</li>'+
						'<li>Tags: '+record[i].tags+'</li>'+
						'<li>ID: '+record[i]._id+'</li>'+
						// '<li>Date Added: '+date.toDateString()+'</li>'+
						// '<li>Best Link: '+record[i].pageURL+'</li>'+
					'</ul>'+
					// '<a href="/edit/'+record[i]._id+'">Edit Record</a>'+
					'<button type="button" id="'+record[i]._id+'" onclick="deleteRecord(event)">Delete Record</button>'+
					'<button type="button" data-toggle="modal" data-target="#editModal"">Edit Record</button>'+
				'</div>';

				jQuery("#record-holder").append(htmlToAdd);
			}
		}
	})	
}


jQuery('#editModal').on('show.bs.modal', function (e) {
  // let's get access to what we just clicked on
  var clickedButton = e.relatedTarget;
  // now let's get its parent
  var parent = jQuery(clickedButton).parent();

  // now, let's get the values of the records that we're wanting to edit
  // we do this by targeting specific spans within the parent and pulling out the text
  var til = $(parent).find('.til').text();
  var context = $(parent).find('.context').text();
  var bestPartDay = $(parent).find('.bestPartDay').text();
  var tags = $(parent).find('.tags').text();
  var id = $(parent).find('.id').text();

  // now let's set the value of the edit fields to those values
 	jQuery("#edit-til").val(til);
	jQuery("#edit-context").val(context);
	jQuery("#edit-bestPartDay").val(bestPartDay);
	jQuery("#edit-tags").val(tags);
	jQuery("#edit-id").val(id);

})


function deleteRecord(event){
	var targetedId = event.target.id;
	console.log('the record to delete is ' + targetedId);

	// now, let's call the delete route with AJAX
	jQuery.ajax({
		url : '/api/delete/'+targetedId,
		dataType : 'json',
		success : function(response) {
			// now, let's re-render the records
			renderRecord();

		}
	})

	event.preventDefault();
}

window.addEventListener('load', init())
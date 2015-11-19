function init() {
  renderRecord();
  renderDisplay();
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
	// var date = jQuery("#edit-date").val();
     
  console.log(id);
      
	// POST the data from above to our API create route
  jQuery.ajax({
  	url : '/api/update/'+id,
  	dataType : 'json',
  	type : 'POST',
  	// we send the data in a data object (with key/value pairs)
  	data : {
  		// date : date,
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
			// console.log(response);

			var record = response.record;

			for(var i=0;i<record.length;i++){
				// turn string into a date object
				var date =  new Date(record[i].dateAdded);

				var htmlToAdd = '<div class="col-md-4">'+
					// '<img src='+record[i].imageUrl+' width="100">'+
					'<h1><span class ="date">'+date.toDateString()+'</span></h1>'+
					'<h1>Today I learned: <span class="til">'+record[i].til+'</span></h1>'+
					'<ul>'+
						'<li>Context: <span class="context">'+record[i].context+'</span></li>'+
						'<li>Best Part Of The Day: <span class="bestPartDay">'+record[i].bestPartDay+'</span></li>'+
						'<li>Tags: <span class="tags">'+record[i].tags+'</span></li>'+
						'<li class="hide">ID: <span class="id">'+record[i]._id+'</span></li>'+
						// '<li>Date Added: '+date.toDateString()+'</li>'+
						// '<li>Best Link: '+record[i].pageURL+'</li>'+
					'</ul>'+
					// '<a href="/edit/'+record[i]._id+'">Edit Record</a>'+
					'<button type="button" class="edit-button" id="'+record[i]._id+'" onclick="deleteRecord(event)">Delete Record</button>'+
					'<button type="button" class="edit-button" data-toggle="modal" data-target="#editModal"">Edit Record</button>'+
				'</div>';

				jQuery("#record-holder").append(htmlToAdd);
			}
		}
	})	
}

// get Record JSON from /api/get
function renderDisplay(){
	// first, make sure the #record-holder is empty
	jQuery('#record-display').empty();

	jQuery.ajax({
		url : '/api/get',
		dataType : 'json',
		success : function(response) {
			// console.log(response);

			var record = response.record;
			// console.log(record);

			var i = record[Math.floor(Math.random()*record.length)];

			console.log(i.til);
	
			// for(var i=0;i<record.length;i++){
			// 	turn string into a date object
				var date =  new Date(i.dateAdded);

				var htmlToAdd = '<div class="col-md-12">'+
					'<h1><span class ="displayDate">'+date.toDateString()+'</span></h1>'+
					'<h2><span class="displayTil">'+i.til+'</span></h2>'+
					'<h2>Context: <span class="displayContext">'+i.context+'</span></h2>'+
					'<h2>The Best Part: <span class="displayBestPartDay">'+i.bestPartDay+'</span></h2>'+
					'<h3>Tags: <span class="tags">'+i.tags+'</span></h3>'+
					'<h2 class="hide">ID: <span class="displayId">'+i._id+'</span></h2>'+
					'<input type="button" class="refresh-button" value="TIME TRAVEL" onClick="window.location.reload()">'+

				'</div>';

				jQuery("#record-display").append(htmlToAdd);
			// }
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
  // var date = $(parent).find('.date').text();
  var til = $(parent).find('.til').text();
  var context = $(parent).find('.context').text();
  var bestPartDay = $(parent).find('.bestPartDay').text();
  var tags = $(parent).find('.tags').text();
  var id = $(parent).find('.id').text();

  // now let's set the value of the edit fields to those values
 	// jQuery("#edit-date").val(date);
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
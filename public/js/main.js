// CUSTOM JS FILE //
//seems to have worked to convert date http://stackoverflow.com/questions/8675642/how-can-i-format-a-date-coming-from-mongodb
//get weird js console: Rangy warning: DEPRECATED: createCssClassApplier in module ClassApplier is deprecated. Please use createClassApplier instead.

function init() {
  renderRecord();
}

function renderRecord(){
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
						// '<li>ID: '+record[i]._id+'</li>'+
						// '<li>Date Added: '+date.toDateString()+'</li>'+
						// '<li>Best Link: '+record[i].pageURL+'</li>'+
					'</ul>'+
					'<a href="/edit/'+record[i]._id+'">Edit Record</a>'+
				'</div>';

				jQuery("#record-holder").append(htmlToAdd);
			}



		}
	})	
}

window.addEventListener('load', init())
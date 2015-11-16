// CUSTOM JS FILE //

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
				var htmlToAdd = '<div class="col-md-4">'+
					// '<img src='+record[i].imageUrl+' width="100">'+
					'<h1>'+record[i].til+'</h1>'+
					'<ul>'+
						'<li>ID: '+record[i]._id+'</li>'+
						'<li>Context: '+record[i].context+'</li>'+
						'<li>Tags: '+record[i].tags+'</li>'+
						'<li>Best Part Of The Day: '+record[i].bestPartDay+'</li>'+
						'<li>Date Added: '+record[i].dateAdded+'</li>'+
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
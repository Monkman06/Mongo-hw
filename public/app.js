// Grab the articles as a json
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) { // For each one
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }// Display the apropos information on the page
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  $("#notes").empty();// Empty the notes from the note section
  var thisId = $(this).attr("data-id"); // Save the id from the p tag

  $.ajax({// Now make an ajax call for the Article
    method: "GET",
    url: "/articles/" + thisId
  })
    .done(function(data) { // With that done, add the note information to the page
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>"); // The title of the article
      $("#notes").append("<input id='titleinput' name='title' >");  // An input to enter a new title
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>"); // A textarea to add a new note body
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");// A button to submit a new note, with the id of the article saved to it
      // If there's a note in the article
      if (data.note) {
        $("#titleinput").val(data.note.title); // Place the title of the note in the title input
        $("#bodyinput").val(data.note.body);// Place the body of the note in the body textarea
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  
  $.ajax({// Run a POST request to change the note, using what's entered in the inputs
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),// Value taken from title input
      body: $("#bodyinput").val()// Value taken from note textarea
    }
  })
    .done(function(data) {// With that done
      console.log(data);// Log the response
      $("#notes").empty();// Empty the notes section
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
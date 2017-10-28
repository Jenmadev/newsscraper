$( document ).ready(function() {
  console.log( "ready!" );

 // Whenever someone clicks a button tag
  $(document).on("click", "#savedButton", function() {
      var thisId = $(this).attr("data-id");
      // Now make an ajax call for the Article
      console.log(thisId);
      // $.ajax({
      //   method: "POST",
      //   url: "/saved",
      //   data:{
      //     _id:thisId
      //   }
      // })
      // .done(function(data){
      //   console.log(data);
      // });
      $.post("/saved",{
        _id:thisId
      },function(data, status){
        console.log(data);
      })

  });
   // When you click the savenote button
   $(document).on("click", "#saveNote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var message = $("#message-text").val();
    $.post("/savenote",{
      _id:thisId,
      text: message
    },function(data, status){
      console.log(data);
    })
  });


  $('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes

  })      
});
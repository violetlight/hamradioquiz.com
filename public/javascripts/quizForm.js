var form = $('form');

form.on('submit', function(e) {
  e.preventDefault();

  var formData = {};
  $.each(form.serializeArray(), function(i, formInput) {
    formData[formInput['name']] = formInput['value'];
  });

  $.ajax({
    method: 'POST',
    url: '/quiz/checkAnswer',
    data: formData
  }).done(function(response, status) {
    // response should be whether or not the answer was correct
    // update DOM accordingly
    console.log(response);
  });
});


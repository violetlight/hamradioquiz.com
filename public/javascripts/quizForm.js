$('#submit-answer')


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
    if (response.isCorrect) {
      $('#answer-choices').find('input').each(function(i) {
        if ($(this).val() === response.chosenAnswer) {
          $(this).parent().addClass('correct');
        }
      });
    } else {
      $('#answer-choices').find('input').each(function(i) {
        if ($(this).val() === response.chosenAnswer) {
          $(this).parent().addClass('incorrect');
        }

        if ($(this).val() === response.correctAnswer) {
          $(this).parent().addClass('correct');
        }
      });
    }
    // remove submit button
    $('#submit-button').remove();
    // replace with 'next question' nav
    $('#controls').append($('<a href="/quiz">Next question</a>'));
  });
});


Number.prototype.mapRange = function(inMin, inMax) {
  return (this - inMin) * (100) / (inMax - inMin);
};


$(function() {
  $('#progressbar').progressbar(); // initialize widget

  $('#numcorrect').each(function() {
    $(this).prop('Counter', 0).animate({
      Counter: $(this).text()
    }, {
      duration: 1000,
      easing: 'swing',
      step: function(now) {
        var now = Math.ceil(now);
        $(this).text(now);

        $('#progressbar').progressbar({ value: now.mapRange(0, $('#numquestions').text()) });
      }
    })
  });
});




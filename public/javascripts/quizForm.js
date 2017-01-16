var form = $('form');


form.on('submit', function(e) {
  var formData = form.serialize();
  e.preventDefault();
  console.log(formData);
});

/* GET home page. */
exports.index = function(req, res){
  res.render('canvMan', {
    title: "Let's Play with Canvas",
    nextPage: "/2"
  });
};

exports.canvasManipulator = function (req, res) {
  res.render('canvMan', {
    scriptNum: '2',
    title: "Canvas with some Slide Action",
    nextPage: "/3"
  });
};

exports.vektorManipulator = function (req, res) {
  res.render('canvMan', {
    scriptNum: '3',
    title: "Canvas + vektor (via Browserify)",
    nextPage: "/"
  });
};

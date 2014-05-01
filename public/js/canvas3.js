var vektor = require('vektor'),
    h = vektor.homog,
    v = vektor.vector,
    r = vektor.rotate;

var ctx = canvas.getContext("2d"),
    moveEE = false;

var LINK_LENGTHS = [100, 100],
    MAX_LENGTH = 200,
    ORIGIN = new v([250, 50, 0]),
    endEff;

function calcJoints (angles) { // forward kinematics

  var joints = [],
      T = h(r.RotX(0), ORIGIN),
      T1 = T.dot(h(r.RotZ(angles[0]), 0)),
      T2 = T1.dot(h(r.RotZ(angles[1]), new v([LINK_LENGTHS[0],0,0]))),
      T3 = T2.dot(h(0, new v([LINK_LENGTHS[1],0,0])));

  endEff = T3.getPoint();

  joints.push(T1.getPoint(), T2.getPoint(), endEff);

  return joints;
}

function drawPoint (x, y, color) {
  ctx.fillStyle = color || 'orange';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawLine (x1, y1, x2, y2, color) {
  ctx.strokeStyle = color || 'blue';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}

function clearRect () {
  ctx.clearRect(0,0,500,300);
}

function drawManipulator (rot1, rot2) {
  var x1 = 0,
      y1 = 100,
      x2 = 100,
      y2 = 100,
      x3 = 200,
      y3 = 100;

  clearRect();
  var joints = calcJoints([rot1, rot2]);

  for (var j = 0; j < joints.length-1; ++j) {
    drawPoint(joints[j].x, joints[j].y,'orange');
    drawLine(joints[j].x, joints[j].y,
             joints[j+1].x, joints[j+1].y, 'blue');
  }

    drawPoint(joints[j].x, joints[j].y, 'yellow');
}

$.domReady(function () {
  drawManipulator(Math.PI / 2,0);

  $('#slider1, #slider2').on('input', function () {
    var val1 = $('#slider1').val(),
        val2 = $('#slider2').val();

    $('.slider1-val').html(val1);
    $('.slider2-val').html(val2);

    drawManipulator(val1 * Math.PI / 180, val2 * Math.PI / 180);
  });

  function getMouseClick (ev) {
    if (moveEE) {
      var offset = $('canvas').offset();
      var pt = {
        x : ev.clientX - offset.left,
        y : ev.clientY - offset.top
      };
      // console.log('clicked on: ',pt);
      click(pt);
    }
  };

  canvas.addEventListener('mousemove', getMouseClick, false);
  canvas.addEventListener('mousedown', function () {
    moveEE = !moveEE;
  });

  function click (pt) { // inverse kinematics
    var pt_v = new v(pt);
    var distToEE = pt_v.distanceFrom(endEff);

    var x = pt.x - ORIGIN.x,
        y = pt.y - ORIGIN.y,
        x_sq = x * x,
        y_sq = y * y,
        l1 = LINK_LENGTHS[0],
        l2 = LINK_LENGTHS[1],
        l1_sq = l1 * l1,
        l2_sq = l2 * l2,
        th1, th2, cth2, sth2;

    // ignore any attempts to move the arm outside of its own physical boundaries
    if (Math.sqrt(x_sq + y_sq) > MAX_LENGTH || y < 0) {
      return false;
    }

    // value of th2 from http://www.cescg.org/CESCG-2002/LBarinka/paper.pdf
    th2 = Math.acos( (x_sq + y_sq - l1_sq - l2_sq) / (2 * l1 * l2) );

    cth2 = Math.cos(th2);
    sth2 = Math.sin(th2);

    // value of th1 from www.site.uottawa.ca/~petriu/generalrobotics.org-ppp-Kinematics_final.ppt‎
    th1 = Math.asin((y * (l1 + l2 * cth2) - x * l2 * sth2) / (x_sq + y_sq));

    $('.slider1-val').text(Math.floor(th1 * 180 / Math.PI));
    $('.slider2-val').text(Math.floor(th2 * 180 / Math.PI));


    drawManipulator(th1, th2);
  }
});

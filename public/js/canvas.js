var ctx = canvas.getContext("2d");

function drawPoint (x, y, color) {
  ctx.fillStyle = color || 'red';
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
  var x1 = 250,
      y1 = 50,
      x2 = 350,
      y2 = 50,
      x3 = 450,
      y3 = 50;

  var t1 = rot1 || 90,
      t2 = rot2 || 0;

  clearRect();
  ctx.save();
  drawPoint(x1,y1,'orange');
  ctx.translate(x1, y1);
  ctx.rotate(t1 * Math.PI / 180);
  ctx.translate(-x1, -y1);
  drawLine(x1,y1,x2,y2,'blue');
  drawPoint(x2,y2,'orange');
  ctx.translate(x2, y2);
  ctx.rotate(t2 * Math.PI / 180);
  ctx.translate(-x2, -y2);
  drawLine(x2,y2,x3,y3,'blue');
  drawPoint(x3,y3,'yellow');
  ctx.restore();
}
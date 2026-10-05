var elements = [],
mouse = {
    x: 0,
    y: 0
};

var MouseElement = function() {
  this.x = 0;
  this.y = 0;
  this.opacity = opacity;
  this.color = 'white';
  this.node = (function(){
    var n = document.createElement("div");
    n.className = "mouseelement";
    document.body.appendChild(n);
    return n;
  }());
};

MouseElement.prototype.draw = function() {
  this.node.style.left = this.x + "px";
  this.node.style.top = this.y + "px";
  this.node.style.opacity = this.opacity;
  this.node.style.background = this.color;
};

var totalElements = 3;
for (let index = 0; index < totalElements; index++) {
  var color;
  if (index % 2 == 0) {
    color = 'rgb(91, 219, 68)';
  } else {
    color = 'rgb(255, 82, 217)';
  }
  var opacity = 1 - (index / totalElements);
  var element = new MouseElement(opacity, color = color);
  elements.push(element);
}

let time = 0;

function draw() {
  time++;

  var x = mouse.x,
    y = mouse.y;
  
  for (let index = elements.length - 1; index >= 0; index--) {
    var element = elements[index];

    if (index === 0) {
      element.x = x + Math.cos(time * 0.01) * 100;
      element.y = y + Math.sin(time * 0.01) * 100;
    } else {
      var prevElement = elements[index - 1];
      element.x = prevElement.x;
      element.y = prevElement.y;
    }
    
    element.draw();
  }
}

addEventListener("mousemove", function(event) {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
});

function animate() {
  draw();
  requestAnimationFrame(animate);
}

animate();

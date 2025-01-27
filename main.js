let grid_space = 10; // Größe der Rasterzellen
let grid = []; // Zustände der Rasterzellen
let cols, rows; // Anzahl der Spalten und Reihen
let dm; // Schriftart
let points; // Punkte des Buchstabens
let fontSize = 200; // Schriftgröße
let letter = 'JO'; // Buchstabe, der gezeichnet werden soll
const defaultBackground = '#849495';

// Regler
let fillToggle, outline, monotone;
const gridShapeSlider = document.getElementById('cornersCount');
const gridSizeSlider = document.getElementById('gridSize');
const pixelSizeSlider = document.getElementById('pixelSize');
const innerRadiusSlider = document.getElementById('innerRadius');

// Standardform
let currentShape = 'rectangle'; // Standardmäßig Rechteck

function preload() {
  dm = loadFont('/fonts/EdwardianScriptITC.ttf'); // Schriftart laden
}

// Function to filter the points dynamically
function filterPoints(points, ratio) {
  randomSeed(1);
  console.log(randNum);
  // Randomly pick a subset of points based on the ratio
  let filtered = [];
  for (let pt of points) {
    if (random() < ratio) {
      filtered.push(pt);
    }
  }
  return filtered;
}

function getCanvasAdaptiveWidth() {
  let sizeMult = 1.3;
  let maxHeight = windowHeight * 0.9;
  let width = 0.9 * artboard.clientWidth;
  if (width > maxHeight) width = maxHeight;
  return width;
}

function readColor(groupIdSelector, defaultColor) {
  const activeButton = document.querySelector(
    `#${groupIdSelector} .button.is-active`
  );
  return activeButton ? activeButton.dataset.color : defaultColor;
}
function readSwitch(switchId) {
  return Array.from(document.getElementById(switchId).classList).includes(
    'is-active'
  );
}

function filterClosePoints(points, minDistance) {
  let filteredPoints = []; // Array to store filtered points

  for (let i = 0; i < points.length; i++) {
    let keepPoint = true;

    for (let j = 0; j < filteredPoints.length; j++) {
      // Check distance to all previously added points
      if (dist(points[i], filteredPoints[j]) < minDistance) {
        keepPoint = false; // Skip this point
        break;
      }
    }

    if (keepPoint) {
      filteredPoints.push(points[i]); // Add the point to the result array
    }
  }

  return filteredPoints;
}

function findMinimalDistance(points) {
  let minDistance = Infinity;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      // Calculate the distance between point i and point j
      let distance = dist(points[i].x, points[i].y, points[j].x, points[j].y);

      // Update minDistance if a smaller distance is found
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  }

  return minDistance;
}

let gridData, minPointsDistance;

function setup() {
  const width = getCanvasAdaptiveWidth();
  const c = createCanvas(width, width);
  c.parent('sketch-wrapper');
  backgroundColor = readColor('background-buttons', defaultBackground);
  background(backgroundColor);

  textFont('Helvetica'); // Setzen der Standard-Schriftart
  textSize(200); // Schriftgröße für den Text

  // points = getLetterPoints();
  // minPointsDistance = findMinimalDistance(points);
  // console.log(minPointsDistance);
}

let textColor1, textColor2, fillValue;

function draw() {
  backgroundColor = readColor('background-buttons', defaultBackground);
  textColor1 = readColor('color-buttons-1', 'black');
  textColor2 = readSwitch('monotone') ? textColor1 : '#D9D9D9';
  fillToggle = document.getElementById('fill').value > 50;
  letter = document.getElementById('display-text').value;
  outline = readSwitch('outline');
  const text = document.getElementById('display-text').value;
  fontSize = text.length == 2 ? 260 : 450;

  background(backgroundColor);
  noStroke();
  fill(255);

  // Werte von den Reglern auslesen
  grid_space = gridSizeSlider.value;
  let innerRadius = innerRadiusSlider.value;
  let pixelSize = pixelSizeSlider.value;
  let numCorners = gridShapeSlider.value;
  let isFilled = false;

  // Buchstabenpunkte aktualisieren
  points = getLetterPoints();
  // points = filterClosePoints(points);
  points = filterPoints(points, grid_space);
  // points = points.slice(0, 4);

  drawGrid(innerRadius, isFilled, pixelSize, numCorners);
}

function windowResized() {
  const width = getCanvasAdaptiveWidth();
  resizeCanvas(width, width); // Adjust canvas size dynamically
}

// Raster initialisieren
function initializeGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0); // Alle Zellen sind im Zustand "off"
  }
  return arr;
}

// Buchstabenpunkte extrahieren
function getLetterPoints() {
  return dm.textToPoints(letter, 0, 0, fontSize, {
    sampleFactor: 0.05, // Steuerung der Punktdichte
    simplifyThreshold: 0, // Keine Vereinfachung
  });
}

// Function to get bounding box of points
function getBounds(points) {
  let minX = min(points.map((p) => p.x));
  let minY = min(points.map((p) => p.y));
  let maxX = max(points.map((p) => p.x));
  let maxY = max(points.map((p) => p.y));

  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  };
}

// Raster zeichnen
function drawGrid(innerRadius, isFilled, pixelSize, numCorners) {
  // Calculate bounding box
  let bounds = getBounds(points);

  // Calculate the center offset
  let centerX = width / 2 - bounds.w / 2;
  let centerY = height / 2 - bounds.h / 2; // +bounds.h/2 because text y grows downward

  // Adjust points to be centered
  points.forEach((p, index) => {
    let adjustedX = centerX + (p.x - bounds.x);
    let adjustedY = centerY + (p.y - bounds.y);

    // if (col >= 0 && col < cols && row >= 0 && row < rows) {
    if (fillToggle) {
      if (outline) stroke('white');
      if (index % 2 !== 0) {
        fill(textColor2);
      } else {
        fill(textColor1);
      }
    } else {
      noFill();
      if (index % 2 !== 0) {
        stroke(textColor2);
      } else {
        stroke(textColor1);
      }
    }
    // Setting color of the figure
    let xPos = adjustedX;
    let yPos = adjustedY;

    push(); // Grafikzustand speichern
    // Stern oder Rechteck/Circle/Triangle zeichnen
    if (numCorners > 2) {
      drawStar(xPos, yPos, numCorners, pixelSize, innerRadius, isFilled);
    } else {
      drawShape(xPos, yPos, pixelSize, isFilled); // Pixel Size hier!
    }
    pop(); // Grafikzustand wiederherstellen
  });
}

// Stern zeichnen
function drawStar(x, y, npoints, outerRadius, innerRadius, isFilled) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
  for (let i = 0; i < TWO_PI; i += angle) {
    // Äußere Spitze
    let outerX = x + cos(i) * outerRadius;
    let outerY = y + sin(i) * outerRadius;

    vertex(outerX, outerY);

    // Innere Spitze
    let innerX = x + cos(i + halfAngle) * innerRadius;
    let innerY = y + sin(i + halfAngle) * innerRadius;
    vertex(innerX, innerY);
  }
  endShape(CLOSE);
}

// Rechteck, Kreis oder Dreieck zeichnen
function drawShape(x, y, size, isFilled) {
  if (currentShape === 'rectangle') {
    rectMode(CENTER);
    rect(x, y, size, size); // Rechteck zeichnen
  } else if (currentShape === 'circle') {
    ellipse(x, y, size, size); // Kreis zeichnen
  } else if (currentShape === 'triangle') {
    triangle(
      x - size / 2,
      y + size / 2, // linke untere Spitze
      x + size / 2,
      y + size / 2, // rechte untere Spitze
      x,
      y - size / 2 // obere Spitze
    ); // Dreieck zeichnen
  }
}

// Save canvas
const saveBtn = document.getElementById('print-btn');
saveBtn.addEventListener('click', function () {
  saveCanvas('highResArtwork', 'png');
});

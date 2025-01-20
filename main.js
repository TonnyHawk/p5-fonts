let grid_space = 10; // Größe der Rasterzellen
let grid = []; // Zustände der Rasterzellen
let cols, rows; // Anzahl der Spalten und Reihen
let dm; // Schriftart
let points; // Punkte des Buchstabens
let fontSize = 200; // Schriftgröße
let letter = 'JO'; // Buchstabe, der gezeichnet werden soll
const defaultBackground = '#E84E26';

// Regler
let fillToggle;
const gridShapeSlider = document.getElementById('cornersCount');
const gridSizeSlider = document.getElementById('gridSize');
const pixelSizeSlider = document.getElementById('pixelSize');
const innerRadiusSlider = document.getElementById('innerRadius');

// Standardform
let currentShape = 'rectangle'; // Standardmäßig Rechteck

function preload() {
  dm = loadFont('/fonts/EdwardianScriptITC.ttf'); // Schriftart laden
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

let gridData;

function setup() {
  const width = getCanvasAdaptiveWidth();
  const c = createCanvas(width, width);
  c.parent('sketch-wrapper');
  backgroundColor = readColor('background-buttons', defaultBackground);
  background(backgroundColor);

  cols = floor(width / grid_space); // Anzahl der Spalten
  rows = floor(height / grid_space); // Anzahl der Reihen
  grid = initializeGrid(cols, rows);

  textFont('Helvetica'); // Setzen der Standard-Schriftart
  textSize(200); // Schriftgröße für den Text

  // fill(fillToggle);

  points = getLetterPoints();
}

// Function to draw visible grid lines
function drawGridCellBorders(gridSpace) {
  stroke(200); // Set cell border color (light gray)
  strokeWeight(1); // Border thickness
  noFill(); // Ensure the cells are not filled
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      // Calculate the top-left corner of each cell
      let x = col * gridSpace;
      let y = row * gridSpace;

      // Draw a rectangle for the cell
      rect(x, y, gridSpace, gridSpace);
    }
  }
}

let textColor1, textColor2;

function draw() {
  backgroundColor = readColor('background-buttons', defaultBackground);
  textColor1 = readColor('color-buttons-1', 'black');
  textColor2 = readColor('color-buttons-2', 'red');
  fillToggle = readSwitch('fill');
  letter = document.getElementById('display-text').value;

  background(backgroundColor);
  noStroke();
  fill(255);

  // Werte von den Reglern auslesen
  grid_space = gridSizeSlider.value;
  let innerRadius = innerRadiusSlider.value;
  let pixelSize = pixelSizeSlider.value;
  let numCorners = gridShapeSlider.value;
  let isFilled = false;

  cols = floor(width / grid_space);
  rows = floor(height / grid_space);
  grid = initializeGrid(cols, rows);

  // Buchstabenpunkte aktualisieren
  points = getLetterPoints();
  // points = points.slice(0, 4);

  drawGrid(innerRadius, isFilled, pixelSize, numCorners);
  drawGridCellBorders(grid_space);
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
function getLetterPoints(density = 0.05) {
  return dm.textToPoints(letter, 0, 0, fontSize, {
    sampleFactor: density, // Steuerung der Punktdichte
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
  let counter = 0;
  points.forEach((p, index) => {
    let adjustedX = p.x + centerX - bounds.x;
    let adjustedY = p.y + centerY - bounds.y;

    let col = floor(adjustedX / grid_space); // Spalte basierend auf Rastergröße
    let row = floor(adjustedY / grid_space); // Reihe basierend auf Rastergröße

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      if (fillToggle) {
        stroke('white');
        if (counter % 2 !== 0) {
          fill(textColor2);
        } else {
          fill(textColor1);
        }
      } else {
        noFill();
        if (counter % 2 !== 0) {
          stroke(textColor2);
        } else {
          stroke(textColor1);
        }
      }

      counter += 1;
      // Setting color of the figure
      let xPos = col * grid_space + grid_space / 2;
      let yPos = row * grid_space + grid_space / 2;

      push(); // Grafikzustand speichern
      // Stern oder Rechteck/Circle/Triangle zeichnen
      if (numCorners > 2) {
        drawStar(xPos, yPos, numCorners, pixelSize, innerRadius, isFilled);
      } else {
        drawShape(xPos, yPos, pixelSize, isFilled); // Pixel Size hier!
      }
      pop(); // Grafikzustand wiederherstellen
    }
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

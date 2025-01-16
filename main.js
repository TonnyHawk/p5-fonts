let grid_space = 10; // Größe der Rasterzellen
let grid = []; // Zustände der Rasterzellen
let cols, rows; // Anzahl der Spalten und Reihen
let dm; // Schriftart
let points; // Punkte des Buchstabens
let fontSize = 200; // Schriftgröße
let letter = 'JO'; // Buchstabe, der gezeichnet werden soll

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

let gridData;

function setup() {
  const width = getCanvasAdaptiveWidth();
  const c = createCanvas(width, width);
  c.parent('sketch-wrapper');
  backgroundColor = readColor('background-buttons', 'white');
  background(backgroundColor);

  cols = floor(width / grid_space); // Anzahl der Spalten
  rows = floor(height / grid_space); // Anzahl der Reihen
  grid = initializeGrid(cols, rows);

  textFont('Helvetica'); // Setzen der Standard-Schriftart
  textSize(200); // Schriftgröße für den Text

  fill('red');

  points = getLetterPoints();

  //   createSlidersOnCanvas(); // Regler erstellen und auf Canvas anordnen
}

function draw() {
  backgroundColor = readColor('background-buttons', 'white');
  textColor = readColor('color-buttons', 'black');
  letter = document.getElementById('display-text').value;

  background(backgroundColor);
  noStroke();
  fill(255);

  // Werte von den Reglern auslesen
  grid_space = gridSizeSlider.value;
  let innerRadius = innerRadiusSlider.value;
  let pixelSize = pixelSizeSlider.value;
  let numCorners = gridShapeSlider.value;
  // let isFilled = fillToggle.checked();
  let isFilled = false;

  cols = floor(width / grid_space);
  rows = floor(height / grid_space);
  grid = initializeGrid(cols, rows);

  // Buchstabenpunkte aktualisieren
  points = getLetterPoints();
  stroke(textColor);
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
function getLetterPoints(density = 0.2) {
  return dm.textToPoints(letter, 20, 10, fontSize, {
    sampleFactor: density, // Steuerung der Punktdichte
    simplifyThreshold: 0, // Keine Vereinfachung
  });
}

// Raster zeichnen
function drawGrid(innerRadius, isFilled, pixelSize, numCorners) {
  for (let p of points) {
    let col = floor(p.x / grid_space); // Spalte basierend auf Rastergröße
    let row = floor(p.y / grid_space); // Reihe basierend auf Rastergröße

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
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
  }
}

// Stern zeichnen
function drawStar(x, y, npoints, outerRadius, innerRadius, isFilled) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  if (isFilled) {
    fill(0);
    noStroke();
  } else {
    noFill();
  }

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
  if (isFilled) {
    noStroke();
    fill(0);
  } else {
    noFill();
  }

  // Je nach Auswahl, eine andere Form zeichnen
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

// save canvas
const saveBtn = document.getElementById('print-btn');
saveBtn.addEventListener('click', function () {
  saveCanvas('highResArtwork', 'png');
});

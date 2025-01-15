
const sliderImageSize = document.getElementById("imageSize");

const inputHeadline = document.getElementById("headline");
const txtSize = document.getElementById("txtSize");

const sliderOffsetX = document.getElementById("offsetX");
const sliderOffsetY = document.getElementById("offsetY");
const test1 = document.getElementById("test1");

var font;

function preload() {
    font = loadFont("/fonts/EdwardianScriptITC.ttf");
}

const artboard = document.querySelector('#artboard');

function createLetterGrid(canvasWidth, canvasHeight, font, gridSpace, letter, fontSize) {
    let cols = Math.floor(canvasWidth / gridSpace); // Anzahl der Spalten
    let rows = Math.floor(canvasHeight / gridSpace); // Anzahl der Reihen
    let grid = initializeGrid(cols, rows); // Raster initialisieren
  
    // Punkte des Buchstabens extrahieren
    let points = font.textToPoints(letter, 100, 300, fontSize, {
      sampleFactor: 0.2, // Dichte der Punkte
      simplifyThreshold: 0, // Keine Vereinfachung
    });
  
    // Buchstabenpunkte auf Raster abbilden
    for (let p of points) {
      let col = Math.floor(p.x / gridSpace); // Spalte basierend auf Rastergröße
      let row = Math.floor(p.y / gridSpace); // Reihe basierend auf Rastergröße
  
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        grid[col][row] = 1; // Setze Zelle auf "on"
      }
    }
  
    return { grid, cols, rows, gridSpace }; // Rückgabe des Rasters und der Metadaten
  }
  
  // Raster initialisieren
  function initializeGrid(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows).fill(0); // Alle Zellen sind im Zustand "off"
    }
    return arr;
  }
  
  // Raster zeichnen
  function drawGrid(gridData) {
    const { grid, cols, rows, gridSpace } = gridData;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        let xPos = x * gridSpace;
        let yPos = y * gridSpace;
  
        if (grid[x][y] === 1) {
          fill(0); // Gefüllte Zellen (Buchstabenpunkte)
        } else {
          fill("OrangeRed"); // Leere Zellen
        }
        noStroke();
        rect(xPos, yPos, gridSpace, gridSpace);
      }
    }
  }
  


let sizeMult = 1.3;
let maxHeight = window.innerHeight * 0.9;
let width = 0.9 * artboard.clientWidth;
if(width > maxHeight) width = maxHeight
let grid_space = 10; // Größe der Rasterzellen

let gridData;

function setup() {
    var c = createCanvas(width, width);
    c.parent("sketch-wrapper");
    imageMode(CENTER);
    gridData = createLetterGrid(600, 600, font, 5, 'E', 300);
}

function draw() {
    background("OrangeRed");
    noStroke();

    translate(width/2,height/2);
    var scalar = map(sliderImageSize.value,0,100,0,2);
    scale(scalar);
    push();
    // textFont(font);
    // textAlign(CENTER,CENTER)
    // textSize(parseInt(txtSize.value));
    // textLeading(parseInt(txtSize.value));
    // text(inputHeadline.value,0,0);
    // pop();

    drawGrid(gridData);
    // createLetterGrid(width, width, font, grid_space, 'TEXT', txtSize)
}
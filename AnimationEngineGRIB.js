// Classes defined here:

// AnimationEngineGRIB
// SourceData
// ParticleSystem
// Particle

class AnimationEngineGRIB {
  // Static variables
  static numActiveAnimations = 0;

  // Variables
  prevTime = 0;
  canvasParticles = undefined;
  source = undefined;
  particles = undefined;
  frameTime = 0;
  FRAMERATE = 40; // in ms
  isDestroyed = false;


  // Constructor for data-based animation
  // dataMatrix has the size of longPoints * latPoints * 2 values (east-north or value-angle)
  // dataFormat is "east_north" || "value_angle"
  // animType is "velocity" || "wave" || "whiteWave"
  constructor(inCanvas, inMap, dataMatrix, minLat, minLong, maxLat, maxLong, dataFormat, animType) {
    AnimationEngineGRIB.numActiveAnimations += 1; // Count the active animations

    this.canvasParticles = inCanvas; // Canvas
    this.map = inMap; // OL map
    // Set height and width of the canvas
    this.canvasParticles.width = this.map.getViewport().offsetWidth;
    this.canvasParticles.height = this.map.getViewport().offsetHeight;
    // Set up variable for when map is moving
    this.mapIsMoving = false;
    // https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
    // Bind the event listeners
    this.onMapMoveStart = this.onMapMoveStart.bind(this);
    this.onMapMoveEnd = this.onMapMoveEnd.bind(this);

    // Define animation format (for particle system)
    let animation = {
      type: animType, //"velocity" || "wave" || "whiteWave";
      format: dataFormat, //"east_north" || "value_angle";
    }

    // Create new source
    this.source = new SourceData(dataMatrix, minLat, minLong, maxLat, maxLong, animation);

    // Create particle system
    this.particles = new ParticleSystem(this.canvasParticles, this.source, this.map);
    this.particles.clear();
    // Reposition particles
    this.particles.repositionParticles();

    // Start drawing loop (only once)
    this.update();
  }

  destroyer() {
    AnimationEngineGRIB.numActiveAnimations += -1;
    this.isDestroyed = true;
  }



  // Update the animation
  update() {
    // Check if it is deleted before anything else, to stop de loop
    if (this.canvasParticles.parentElement == null) {
      console.log("destroyed")
      return;
    }
    if (this.isDestroyed) {
      console.log("destroyed by destroyer");
      return;
    }

    // Update timer
    let timeNow = performance.now();
    let dt = (timeNow - this.prevTime) / 1000; // in seconds;
    this.frameTime = dt;
    this.prevTime = timeNow;

    // If data is loaded and layer is visible
    if (this.source) {
      //console.log(this.source.wmsURL);
      if (this.source.isReady)
        if (!this.mapIsMoving)
          this.particles.draw(dt);
    }

    // Loop
    //var that = this;
    //setTimeout(function() {that.update()}, that.FRAMERATE); // Frame rate in milliseconds
    setTimeout(() => this.update(), this.FRAMERATE);
  }


  // Callback when source is loaded
  onSourceLoad() {
    console.log("Source loaded!");
    // Reposition particles when data is loaded
    this.particles.repositionParticles();
  }

  resizeCanvas() {
    // Resize animation canvas
    this.canvasParticles.width = this.map.getViewport().offsetWidth;
    this.canvasParticles.height = this.map.getViewport().offsetHeight;
    // Resize num of particles
    this.particles.resizeNumParticles();
  }


  // Callback when map size changes
  onMapMoveEnd() {
    this.resizeCanvas();
    this.mapIsMoving = false;
    if (this.source) {
      if (this.source.isReady) {
        this.particles.repositionParticles();
      }
    }
  }
  onMapMoveStart() {
    if (this.particles)
      this.particles.clear();
    this.mapIsMoving = true;
  }




  // PUBLIC METHOD
  static getNumActiveAnimations() {
    return AnimationEngineGRIB.numActiveAnimations;
  }

}








// Class that defines the source from a single WMS image
// class SourceWMS {
//   // Variables
//   imgDataEast;
//   imgDataNorth;

//   canvasLongLatStep = 0.02;
//   colorrange;

//   //medBBOX = [-19, 36, 31, 45]; // LONG, LAT -18.12, 36.3, 45.98, 30.18 from https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_WAV_006_017/INFORMATION
//   // WMS service does not always provide the BBOX given, be careful. Check with the URL
//   medBBOX = [-17, 30, 30, 45];
//   catseaBBOX = [-1, 36, 9, 44]; // LONG, LAT


//   // Constructor
//   constructor(animation) {
//     this.isReady = false;
//     this.animation = animation;
//   }

//   // When all tiles from layer are loaded, call a function
//   defineOnLoadCallback(callbackOnLoad) {
//     this.callbackFunc = callbackOnLoad; // Defined in Animation Engine
//   }

//   // Update/Change the WMS Source
//   updateWMSSource(wmsURL, animation) {
//     // Keep track of images loaded
//     this.isReady = false;
//     this.loaded = 0;
//     // Store animation information defined in ForecastBar.vue
//     this.animation = animation;
//     this.wmsURL = wmsURL; // Only for debuggin;


//     // Define WMS image url with a standard size
//     // SIZE TODO: could be random size or according to lat-long extension?
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'WIDTH', '2048');
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'HEIGHT', '1024');

//     // BBOX
//     this.bbox = this.medBBOX;//this.catseaBBOX;
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'BBOX', JSON.stringify(this.bbox).replace('[', '').replace(']', ''));
//     // STYLE gray
//     let style = 'boxfill/greyscale';
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'STYLES', style);

//     // PROJECTION EPSG:4326 (lat and long are equally distributed in pixels)
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'PROJECTION', 'EPSG:4326');

//     // OUT OF RANGE PIXELS &ABOVEMAXCOLOR=extend&BELOWMINCOLOR=extend
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'ABOVEMAXCOLOR', 'extend');
//     wmsURL = SourceWMS.setWMSParameter(wmsURL, 'BELOWMINCOLOR', 'extend');

//     // COLORRANGE
//     this.colorrange = SourceWMS.getWMSParameter(wmsURL, 'COLORSCALERANGE').split('%2C');
//     this.colorrange = this.colorrange.map((e) => parseFloat(e));


//     // Paint this image streched in a canvas of width and height related to the bounding box
//     // Each pixel corresponds to a lat-long
//     this.longExtension = Math.abs(this.bbox[0] - this.bbox[1]);
//     this.latExtension = Math.abs(this.bbox[2] - this.bbox[3]);

//     // Make canvas lat-long relationship
//     let canvas = document.createElement('canvas');
//     canvas.width = this.longExtension / this.canvasLongLatStep;
//     canvas.height = this.latExtension / this.canvasLongLatStep;

//     let ctx = canvas.getContext('2d');
//     //document.body.append(canvas);

//     // WMS data layers
//     if (animation.layerNames.length == 2) {
//       for (let i = 0; i < 2; i++) {
//         // LAYER east and north or intensity and angle
//         wmsURL = SourceWMS.setWMSParameter(wmsURL, 'LAYERS', animation.layerNames[i]);
//         // For data stored in intensity and angle, the colorrange of the angle should go from 0 to 360
//         if (animation.format == 'value_angle' && i == 1)
//           wmsURL = SourceWMS.setWMSParameter(wmsURL, 'COLORSCALERANGE', '0,360');
//         // For data stored in east-north, there range should have negative values too
//         else if (animation.format == 'east_north') {
//           this.colorrange[0] = -this.colorrange[1];
//           wmsURL = SourceWMS.setWMSParameter(wmsURL, 'COLORSCALERANGE', this.colorrange.toString());
//         }

//         // Get WMS image data
//         console.log("Loading data source WMS images...");
//         let img = new Image();
//         img.crossOrigin = "Anonymous";
//         // Image is loaded, paint it in the canvas and get the data
//         img.onload = () => {
//           // Paint streched WMS image in canvas
//           // For more details: https://developer.mozilla.org/es/docs/Web/CSS/image-rendering
//           ctx.clearRect(img, 0, 0, canvas.width, canvas.height);
//           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//           if (i == 0)
//             this.imgDataEast = ctx.getImageData(0, 0, canvas.width, canvas.height); // Store image data
//           else
//             this.imgDataNorth = ctx.getImageData(0, 0, canvas.width, canvas.height); // Store image data

//           this.loaded++;

//           // Both layers are loaded
//           if (this.loaded == 2) {
//             this.isReady = true;
//             //document.body.append(canvas);
//             // Callback
//             if (this.callbackFunc)
//               this.callbackFunc();
//           }
//         };
//         // Start loading image
//         img.src = wmsURL;
//         console.log(wmsURL);
//       }
//     }

//   }



//   // Set WMS parameter
//   static setWMSParameter(wmsURL, paramName, paramContent) {
//     // If parameter does not exist
//     if (wmsURL.indexOf(paramName + "=") == -1) {
//       console.log("Parameter ", paramName, " does not exist in WMS URL");
//       return wmsURL + '&' + paramName + '=' + paramContent;
//     }
//     let currentContent = SourceWMS.getWMSParameter(wmsURL, paramName);
//     return wmsURL.replace(currentContent, paramContent);
//   }


//   // Get WMS parameter
//   static getWMSParameter(wmsURL, paramName) {
//     // If parameter does not exist
//     if (wmsURL.indexOf(paramName + "=") == -1) {
//       console.log("Parameter ", paramName, " does not exist in WMS URL");
//       return '';
//     }
//     let tmpSTR = wmsURL.substr(wmsURL.indexOf(paramName + "="));
//     let endOfContent = tmpSTR.indexOf('&') == -1 ? tmpSTR.length : tmpSTR.indexOf('&');
//     return tmpSTR.substring(paramName.length + 1, endOfContent);
//   }


//   // Get value at Long Lat
//   getValueAtLongLat(long, lat, value) {

//     // If is outside bbox
//     let minLong = Math.min(this.bbox[0], this.bbox[1]);
//     let minLat = Math.min(this.bbox[2], this.bbox[3]);
//     if (lat < minLat || lat > Math.max(this.bbox[2], this.bbox[3]) || // lat
//       long < minLong || long > Math.max(this.bbox[0], this.bbox[1])) { // long
//       value[0] = undefined; value[1] = undefined; // Reset value
//       return value;
//     }

//     // Get closest pixel to long lat (nearest-neighbour interpolation)
//     let colPixelPos = Math.round((long - minLong) / this.canvasLongLatStep);
//     let rowPixelPos = Math.round((lat - minLat) / this.canvasLongLatStep);
//     // Invert row pixel position (mirror data on the horizontal axis)
//     rowPixelPos = this.imgDataEast.height - rowPixelPos;

//     // Index
//     let index = rowPixelPos * this.imgDataEast.width + colPixelPos;
//     // Get RGB values (grayscale)
//     let redE = this.imgDataEast.data[index * 4] / 255; //R east
//     let redN = this.imgDataNorth.data[index * 4] / 255; //R north
//     let alphaE = this.imgDataEast.data[index * 4 + 3] / 255; // Alpha

//     // Low alpha
//     if (alphaE < 0.1) {
//       value[0] = undefined; value[1] = undefined; // Reset value
//       return value;
//     }


//     // Rescale RGB value to real unit
//     // Images store East and North intensity
//     if (this.animation.format == 'east_north') {
//       value[0] = redE * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0]; // lat
//       value[1] = redN * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0]; // long
//     }
//     // Images store Intensity and Angle in degrees
//     else if (this.animation.format == 'value_angle') {
//       let intensity = redE * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0];
//       let angle = redN * 360;
//       value[1] = - 0.1 * Math.cos(angle * Math.PI / 180) * intensity;
//       value[0] = - 0.1 * Math.sin(angle * Math.PI / 180) * intensity;
//     }

//     //console.log(long + ", " + lat + ", " + value);

//     return value;
//   }

//   /*getValueAtPixel(pixel, value) {

//     let index = pixel[0] * this.imgDataEast.width + pixel[1];
//     if (index > this.imgDataEast.data.length)
//       return [0, 0];

//     // Get RGB values (grayscale)
//     let redE = this.imgDataEast.data[index * 4] / 255; //R east
//     let redN = this.imgDataNorth.data[index * 4] / 255; //R north
//     // Rescale RGB value to real unit
//     value[0] = redE * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0]; // lat
//     value[1] = redN * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0]; // long

//     return value
//   }*/

// }




class SourceData {

  constructor(dataMatrix, minLat, minLong, maxLat, maxLong, animation) {
    this.dataMatrix = dataMatrix;
    this.minLat = minLat;
    this.minLong = minLong;
    this.maxLat = maxLat;
    this.maxLong = maxLong;
    this.animation = animation;

    // Get max and min values
    // WHY IS THIS NECESSARY? FOR ANIMATION PATH?
    this.maxValue =  -Infinity;
    
    for (let i = 0; i < dataMatrix.length; i++){
      for (let j = 0; j < dataMatrix[0].length; j++){
        let valueU = dataMatrix[i][j][0];
        let valueV = dataMatrix[i][j][1];
        if (!isNaN(valueU) && !isNaN(valueV)){
          this.maxValue = Math.max(this.maxValue, Math.abs(valueU));
          this.maxValue = Math.max(this.maxValue, Math.abs(valueV));
        }
        
      }
    }

    this.isReady = true;
  }

  getValueAtLongLat = function (long, lat, value) {
    if ((lat < this.minLat || lat > this.maxLat) || // lat
      (long < this.minLong || long > this.maxLong)) { // long
      value[0] = undefined; value[1] = undefined; // Reset value
      return value;
    }

    let numRows = this.dataMatrix.length;
    let numCols = this.dataMatrix[0].length;
    let iIndex = Math.floor(numRows * (lat - this.minLat) / (this.maxLat - this.minLat));
    let jIndex = Math.floor(numCols * (long - this.minLong) / (this.maxLong - this.minLong));
    iIndex = -iIndex + numRows - 1; // Mirror
    
    value[0] = this.dataMatrix[iIndex][jIndex][0];
    value[1] = this.dataMatrix[iIndex][jIndex][1];
    value[0] = (value[0] === null || isNaN(value[0])) ? undefined : value[0];
    value[1] = (value[1] === null || isNaN(value[1])) ? undefined : value[1];

    // Find location
    return value;
  }

}





// Class that manages the particle system
class ParticleSystem {
  // Variables
  fullScreenNumParticles = 10000;
  speedFactor = 0.7;
  fullScreenPixels = 1920 * 1080;

  // Constructor
  constructor(canvas, source, olMap) {
    // Canvas
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    // Source
    this.source = source;
    // Map
    this.map = olMap;
    // Number of particles
    this.resizeNumParticles();

    // Create particles
    this.particles = [];
    for (let i = 0; i < this.fullScreenNumParticles; i++)
      this.particles[i] = new Particle(this);
  }


  // Functions
  // Set num particles according to the number of pixels
  resizeNumParticles() {
    let numPixels = this.canvas.width * this.canvas.height;
    let numParticlesFactor = numPixels / this.fullScreenPixels;
    // Active number of animations
    numParticlesFactor /= AnimationEngineGRIB.getNumActiveAnimations();
    // Define number of particles
    this.numParticles = Math.min(Math.round(numParticlesFactor * this.fullScreenNumParticles), this.fullScreenNumParticles);
  }
  // Reposition particles
  repositionParticles() {
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i].repositionParticle();
  }

  // Clear canvas and reset particles. Important when the map moves, because some undesired lines appear
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(dt) {

    // Trail effect
    // https://codepen.io/Tyriar/pen/BfizE
    this.ctx.fillStyle = 'rgba(255, 255, 255, .9)';
    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = "source-over";
    // Trail color
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

    // Line style
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i].draw(dt);
    this.ctx.stroke();
  }

}







// Particle class
class Particle {
  // Variables
  numVerticesPath = 20;
  stepInPixels = 20; // Step (ideally in lat, long, not in pixels)
  color = [0, 0, 0];

  // Constructor
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.life = Math.random();

    // Variable for optimization
    this.valueVec2 = [0, 0];
    this.pointVec2 = [0, 0];
    // Variables for drawing
    this.prevPos = [0, 0];
    this.currentPos = [0, 0];

    // Drawing function
    if (particleSystem.source.animation.type == 'velocity') {
      this.draw = this.drawVelocity;
      this.numVerticesPath = 20;
      this.stepInPixels = 20;
    }
    else if (particleSystem.source.animation.type == 'wind') {
      this.draw = this.drawVelocity;
      this.numVerticesPath = 20;
      this.stepInPixels = 1;
      this.particleSystem.speedFactor = 0.01;
    }
    else if (particleSystem.source.animation.type == 'wave') {
      this.draw = this.drawWaves;
      this.numVerticesPath = 8;
      this.stepInPixels = 20;
    }
    else if (particleSystem.source.animation.type == 'whiteWave') {
      this.draw = this.drawWaves;
      this.numVerticesPath = 4;
      this.stepInPixels = 20;
      this.color = [255, 255, 255];
      this.particleSystem.speedFactor = 6;
    }

    this.vertices = new Float32Array(this.numVerticesPath * 2); // XY values
    this.verticesValue = new Float32Array(this.numVerticesPath); // Wind/Current/Wave
  }

  // Functions
  // Reposition particle
  repositionParticle() {
    // Reset previous position for painting path
    this.prevPos[0] = undefined;
    this.prevPos[1] = undefined;
    // Generate starting vertex with initial value
    this.generatePoint(this.pointVec2, this.valueVec2);
    // Assign initial position
    this.vertices[0] = this.pointVec2[0];
    this.vertices[1] = this.pointVec2[1];

    // Create vertices path
    for (var i = 1; i < this.numVerticesPath; i++) {
      // Make step
      // North is inverted because of pixels (less pixels, more nord)
      this.pointVec2[0] += this.valueVec2[0] * this.stepInPixels || 0; // 0 if there is no data
      this.pointVec2[1] -= this.valueVec2[1] * this.stepInPixels || 0; // 0 if there is no data
      // Assign positions to vertices array
      this.vertices[i * 2] = this.pointVec2[0];
      this.vertices[i * 2 + 1] = this.pointVec2[1];
      // Get new value according to point
      //this.valueVec2 = this.particleSystem.source.getValueAtPixel(this.pointVec2, this.valueVec2); // Is rounding the pixel movement, could be done with floats

      // Transform pixel to long lat
      let coord = this.particleSystem.map.getCoordinateFromPixel(this.pointVec2);
      if (coord == null)
        return;
      
      //coord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
      // Get new value according to longitude and latitude
      this.valueVec2 = this.particleSystem.source.getValueAtLongLat(coord[0], coord[1], this.valueVec2);
      // Assign values
      if (this.valueVec2[0] !== undefined)
        this.verticesValue[i] = Math.sqrt(this.valueVec2[0] * this.valueVec2[0] + this.valueVec2[1] * this.valueVec2[1]);
    }

  }


  // Generate new point
  // Could be done more intelligent, like taking the extent of the layer from openlayers or the WMS service
  generatePoint(point, value, callStackNum) {
    callStackNum = callStackNum || 1;
    // Generate random X,Y number
    // TODO: random should be within lat-long limits
    let source = this.particleSystem.source;
    let map = this.particleSystem.map;
    let ppWidth = this.particleSystem.canvas.width;
    let ppHeight = this.particleSystem.canvas.height;
    let ppMin = map.getPixelFromCoordinate([source.minLong, source.minLat]);
    let ppMax = map.getPixelFromCoordinate([source.maxLong, source.maxLat]);
    if (ppMin == null)
      return;
    // Limit bbox
    ppMin[0] = ppMin[0] < 0 ? 0 : ppMin[0] > ppWidth ? ppWidth : ppMin[0];
    ppMin[1] = ppMin[1] < 0 ? 0 : ppMin[1] > ppHeight ? ppWidth : ppMin[1];
    ppMax[0] = ppMax[0] < 0 ? 0 : ppMax[0] > ppWidth ? ppWidth : ppMax[0];
    ppMax[1] = ppMax[1] < 0 ? 0 : ppMax[1] > ppHeight ? ppWidth : ppMax[1];


    point[0] = Math.random() * (ppMax[0] - ppMin[0]) + ppMin[0];//Math.random() * this.particleSystem.canvas.width;
    point[1] = Math.random() * (ppMin[1] - ppMax[1]) + ppMax[1];//Math.random() * this.particleSystem.canvas.height;
    // Check if it has data
    if (point[0] == undefined || isNaN(point[0]) || point[0] == null)
      console.error(point);
    // Get value at pixel
    // Transform pixel to long lat
    let coord = this.particleSystem.map.getCoordinateFromPixel(point); // returns [long,lat]?
    if (coord == null && callStackNum < 20) { // Library is not loaded yet?
      callStackNum++;
      this.generatePoint(point, value, callStackNum);
    }
    else if (callStackNum >= 20){ // Library is not yet loaded
      return;
    }
    //coord = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326'); // HACK: I don't know why in this map it is already in 4326
    // Get value at long lat from source
    //value = this.particleSystem.source.getValueAtPixel(point, value);
    value = this.particleSystem.source.getValueAtLongLat(coord[0], coord[1], value);


    // If pixel does not contain data, throw it again at least 20 times
    if (value[0] == undefined && callStackNum < 20) {
      this.generatePoint(point, value, callStackNum + 1); // Recursive function
    }
  }


  // Draw / Update
  drawVelocity(dt) {

    // Update life
    this.life += 0.005 + this.particleSystem.speedFactor * 0.1 * this.verticesValue[Math.round(this.life * this.numVerticesPath)];
    // Reset life
    if (this.life > 1 || isNaN(this.life)) {
      this.life = Math.random();
      // Start of vertices path
      this.prevPos[0] = undefined;
      this.prevPos[1] = undefined;
    }

    // Get exact position
    let prevVertPath = Math.floor(this.life * (this.numVerticesPath - 1)); // From 0 to numVerticesPath
    let nextVertPath = Math.ceil(this.life * (this.numVerticesPath - 1)); // From 0 to numVerticesPath

    // Interpolation value
    let interpCoeff = (nextVertPath - this.life * (this.numVerticesPath - 1));
    this.currentPos[0] = interpCoeff * this.vertices[prevVertPath * 2] +
      (1 - interpCoeff) * this.vertices[nextVertPath * 2];
    this.currentPos[1] = interpCoeff * this.vertices[prevVertPath * 2 + 1] +
      (1 - interpCoeff) * this.vertices[nextVertPath * 2 + 1];

    // When prevPos is not valid (map moved, source changed, etc)
    if (this.prevPos[0] == undefined) {
      this.prevPos[0] = this.currentPos[0];
      this.prevPos[1] = this.currentPos[1];
      return;
    }


    // Draw in canvas
    let ctx = this.particleSystem.ctx;
    ctx.moveTo(this.prevPos[0], this.prevPos[1])
    ctx.lineTo(this.currentPos[0], this.currentPos[1]);

    // Assign prevPos
    this.prevPos[0] = this.currentPos[0];
    this.prevPos[1] = this.currentPos[1];

  }


  // Draw waves
  drawWaves(dt) {
    // Value
    let value = this.verticesValue[Math.round(this.life * this.numVerticesPath)];
    // Update life
    this.life += 0.01 + this.particleSystem.speedFactor * 0.01;
    // Reset life
    if (this.life > 1 || isNaN(this.life)) {
      this.life = Math.random();
      // Start of vertices path
      this.prevPos[0] = undefined;
      this.prevPos[1] = undefined;
    }

    // Get exact position
    let prevVertPath = Math.floor(this.life * (this.numVerticesPath - 1)); // From 0 to numVerticesPath
    let nextVertPath = Math.ceil(this.life * (this.numVerticesPath - 1)); // From 0 to numVerticesPath

    // Interpolation value
    let interpCoeff = (nextVertPath - this.life * (this.numVerticesPath - 1));
    this.currentPos[0] = interpCoeff * this.vertices[prevVertPath * 2] +
      (1 - interpCoeff) * this.vertices[nextVertPath * 2];
    this.currentPos[1] = interpCoeff * this.vertices[prevVertPath * 2 + 1] +
      (1 - interpCoeff) * this.vertices[nextVertPath * 2 + 1];

    // When prevPos is not valid (map moved, source changed, etc)
    if (this.prevPos[0] == undefined) {
      this.prevPos[0] = this.currentPos[0];
      this.prevPos[1] = this.currentPos[1];
      return;
    }

    // Varying alpha (strongest alpha in the middle of the path)
    let alphaFactor = 16 * Math.pow((1 - this.life) * (this.life), 2);

    // Draw in canvas
    let ctx = this.particleSystem.ctx;
    // Change linewidth according to value
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = Math.max(value * 15, 4);
    //ctx.fillStyle = 'rgba(0, 0, 0, ', alphaFactor*0.0, ')';
    let colorStr = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ', ' + alphaFactor * 0.5 + ')'
    ctx.strokeStyle = colorStr; // Makes the app go slow, consider something different
    ctx.moveTo(this.prevPos[0], this.prevPos[1])
    ctx.lineTo(this.currentPos[0], this.currentPos[1]);

    // Assign prevPos
    this.prevPos[0] = this.currentPos[0];
    this.prevPos[1] = this.currentPos[1];
  }
}








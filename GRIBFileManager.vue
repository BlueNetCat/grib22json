<template>
  <div id="grib-manager">

    <!-- Open layers map -->
    <div id="map" v-on:drop="onDropFile($event)" v-on:dragover="onDragOver($event)" class="map position-absolute vh-100 vw-100"></div>

    <!-- Drag and drop info -->
    <div class="position-absolute container-fluid" style="text-align: center;max-width: 100%;"> Drag and drop you GRIB files anywhere in the map </div>

    <!-- Dropped files -->
    <div class="position-absolute m-4" style="margin-top: 20px;">
      <div class="row-fluid p-1" style="" :key="layer.name" v-for="layer in layersEl">
        <!--div class="col p-1"-->
          <button class="col col-md-auto button" :class="{'btn-primary':layer.layer.getVisible()}" type="button" :id="layer.name" v-on:click="onLayerClicked($event)">
            {{layer.name}}
          </button>
        <!--/div-->
      </div>
    </div>

  </div>
</template>






<script>
// Import components
//import Map from "Map.vue";

export default {
  name: "grib-manager",
  created(){

  },
  mounted () {
    // Openlayers map
    this.map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'https://ahocevar.com/geoserver/wms',
                    params: {
                        'LAYERS': 'ne:NE1_HR_LC_SR_W_DR',
                        'TILED': true,
                    },
                    cacheSize: 500,
                    crossOrigin: 'anonymous',
                }),
            }),
        ],
        target: 'map',
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [0, 0],
            zoom: 2,
        }),
    });
    // Load an example of a grib file
    //fetch('datasets/COSMODE_single_level_elements_PS_2018020500_000.grib2')
    //fetch('datasets/COSMODE_single_level_elements_ASWDIR_S_2018011803_006.grib2')
    fetch('datasets/gdas.t00z.pgrb2.0p25.f000.grib2') // temperature in kelvins
    //fetch('datasets/gdas.t00z.pgrb2.1p00.f000.grib2') // winds
    //fetch('datasets/winds.grb')
        .then(response => response.arrayBuffer())
        .then(buffer => decodeGRIB2File(buffer))
        .then(gribFiles => this.addGribToMap(gribFiles, 'example'))
        .catch(error => console.log(error));


  },
  data () {
    return {
      layersEl: []
    }
  },
  methods: {
    addLayerHTML: function(name, layer) {
      this.layersEl.push({name, layer});
    },

    // When layer name is clicked
    onLayerClicked: function(event) {
      // Make the layer not visible
      console.log(event.currentTarget.id);
      this.layersEl.forEach(ll => {if (ll.name == event.currentTarget.id) {
        ll.layer.setVisible(!ll.layer.getVisible());
      }})
    },

    // On drag over event (nothing happens)
    // https://github.com/Web-based-vocoder/webbasedVocoder/blob/main/script.js
    onDragOver: function(event) {
        event.preventDefault();
        event.stopPropagation();
    },
    // On drop event
    onDropFile: function(event) {
        event.preventDefault();
        event.stopPropagation();

        let files = event.dataTransfer.files;

        console.log(files.length + " files dropped.");

        // Iterate files
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            this.loadDroppedFile(file);
        }
    },


    // Load file (arraybuffer grib)
    loadDroppedFile: function(file){
      let reader = new FileReader();
      reader.fileName = file.name;
      
      // Load files
      reader.addEventListener('load', e => {
          
          let arrayBuffer = e.target.result;
          let fName = reader.fileName;
          console.log(fName + ' received.');

          // Decode grib file
          let gribFiles = decodeGRIB2File(arrayBuffer);

          this.addGribToMap(gribFiles, fName);

      });
      // Trigger the load event
      reader.readAsArrayBuffer(file);
    },


    // Add decoded GRIB files to map
    addGribToMap: function(gribFiles, fName){
      // Iterate through grib data
      for (let j = 0; j<gribFiles.length; j++){
        let gribFile = gribFiles[j];

        // Add data to map
        let minLat = Math.min(gribFile.data.grid.latStart, gribFile.data.grid.latEnd);
        let maxLat = Math.max(gribFile.data.grid.latStart, gribFile.data.grid.latEnd);
        let minLon = gribFile.data.grid.lonStart;//Math.min(gribFile.data.grid.lonStart, gribFile.data.grid.lonEnd);
        let maxLon = gribFile.data.grid.lonEnd;//Math.max(gribFile.data.grid.lonStart, gribFile.data.grid.lonEnd);

        if (minLon > 180){
            minLon = minLon-360;
        }

        let extent = [minLon, minLat, maxLon, maxLat];

        //console.log(extent);
        let imageLayer = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: gribFile.imgEl.src,
                projection: 'EPSG:4326',
                imageExtent: extent,
            }),
            opacity: 0.8
        });
        
        this.map.addLayer(imageLayer);
        this.addLayerHTML(fName + " - " + j, imageLayer);
      }
    },

  },
  components: {

  },
  computed: {
  }
}


</script>





<style scoped>
#animationCanvas {
  background: none;
}

</style>
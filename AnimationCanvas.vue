<template>
  <div id="app-animation" ref="app-animation">

    <div class="container" style="position: absolute; margin: 0px 0px 0px 0px; bottom: 10px; left: 10px; font-size: .875rem">
      <div class="row row-cols-auto p-1" :key="anim.id" v-for="anim in animHTML">
        <button type="button" class="col-sm-auto btn btn-dark rounded-pill"
          style="font-size: smaller"
            :class="anim.class"  :id="anim.id" :title=anim.tooltip @click.prevent="animClicked">
            {{anim.name}}
            <button type="button" class="btn-close btn-close-white" style="font-size: smaller" aria-label="Close" @click.stop ="closeAnimClicked"></button>
        </button>
      </div>
    </div>

  </div>
</template>






<script>


export default {
  name: "app-animation",
  // https://github.com/vuejs/vue/issues/1988
  created(){
    // Non-reactive variables
    this.animations = [];
    this.OLMap = undefined;
  },
  mounted () {

  },
  data () {
    return {
      animHTML: [],
    }
  },
  methods: {
    // USER HTML ACTIONS
    // Animation HTML EL clicked
    // Hides/unhides canvas element
    animClicked: function(event) {
      // Get animObj id
      let id = event.currentTarget.id;
      // Find animEl
      let animSel;
      this.animations.forEach(a => {if (id == a.id) animSel = a;});
      animSel.canvas.hidden = !animSel.canvas.hidden;
      // Change button class
      if (animSel.canvas.hidden){ // Add opacity class
        this.animHTML.forEach(item => {if (id == item.id) item.class = 'opacity-75'});
      } else // Remove class
        this.animHTML.forEach(item => {if (id == item.id) item.class = ''});
    },
    // Closed animation clicked. Destroys the animation
    closeAnimClicked: function(event) {
      // Get id
      let id = event.currentTarget.parentElement.id;
      // Destroy animation
      this.destroyAnim(id);
      // Update visibility of remaining buttons
      let delIdx;
      this.animHTML.forEach((el, idx) => {if (el.id == id) delIdx = idx});
      this.animHTML.splice(delIdx, 1);
    },







    // Destroys the animation clicked
    destroyAnim: function(id){
      // Find selected animation and index
      let animSel;
      let idxSel;
      this.animations.forEach((a, idx) => {if (id == a.id) {animSel = a; idxSel = idx}});
      // Destroy animation item
      let animObj = this.animations.splice(idxSel, 1)[0]; // The animation will stop because the canvas has no parent element
      // TODO: GC (reuse anim object?)
      // Remove canvas from HTML DOM
      animObj.canvas.remove();
      // Remove event listeners
      let animEng = animObj.animEngine;
      //console.log("Deleted "+ animObj.id + ". Canvas parent element: " + animEng.canvasParticles.parentElement)
      animEng.map.un('movestart', animEng.onMapMoveStart);
      animEng.map.un('moveend', animEng.onMapMoveEnd);
      // Call destroy function
      animEng.destroyer();
      animEng = null;
    },





    // PUBLIC METHODS
    // Creates a new animation
    createAnimation: function(info, gribFileU, gribFileV, OLMap, animType){ // Called from GRIBFileManager.vue
      // Declare OLMap
      this.OLMap = OLMap;

      // Create canvas
      let canvas = document.createElement("canvas");
      canvas.className = "position-absolute pe-none vh-100 vw-100";
      canvas.id = info.name;

      // Append to HTML DOM
      this.$refs["app-animation"].appendChild(canvas);

      
      // Get max-min long and lat
      let gridU = gribFileU.data.grid;
      let minLat = Math.min(gridU.latStart, gridU.latEnd);
      let maxLat = Math.max(gridU.latStart, gridU.latEnd);
      let minLong = gridU.lonStart;//Math.min(gribFile.data.grid.lonStart, gribFile.data.grid.lonEnd);
      let maxLong = gridU.lonEnd;//Math.max(gribFile.data.grid.lonStart, gribFile.data.grid.lonEnd);
      // TODO: check that the V has the same numbers

      if (minLong > 180) {
        minLong = minLong - 360;
      }

      // Create data matrix
      let dataMatrix = [];
      let index = 0;
      for (let i = 0; i < gridU.numLatPoints; i++){
        dataMatrix[i] = [];
        for (let j = 0; j < gridU.numLongPoints; j++){
          dataMatrix[i][j] = [gribFileU.data.values[index], gribFileV.data.values[index]];
          index++;
        }
      }

      // Create animation engine
      //(inCanvas, inMap, dataMatrix, minLat, minLong, maxLat, maxLong, dataFormat, animType)
      let animEngine = new AnimationEngineGRIB(canvas, this.OLMap, dataMatrix, minLat, minLong, maxLat, maxLong, "east_north", animType);

      // Define map events for animation
      // Update canvas and positions
      this.OLMap.on('moveend', animEngine.onMapMoveEnd);
      // Clear canvas
      this.OLMap.on('movestart', animEngine.onMapMoveStart);

      // Store animation in array
      this.animations.push({
        id: info.name,
        name: info.name,
        info: info,
        animEngine: animEngine,
        canvas: canvas
      });

      // Create reactive data
      this.animHTML.push({
        id: info.name,
        name: info.name,
        tooltip: info.tooltip,
        class: ''
      })

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

.opacity-75{
  opacity: 0.75;
}

</style>
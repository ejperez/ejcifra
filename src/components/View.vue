<template>
	<div class="index">
	  	<ul>
			<li><router-link v-bind:to="{ name: 'Index' }">Songs</router-link></li>
			<li>{{ song ? song.title : '' }}</li>
	  	</ul>
		<div v-html="content"></div>
	</div>
</template>

<script>
import SongsService from "../services/SongsService";
import ChordPlusParser from "chord-plus/src/chord-plus-parser";
import ChordPlusFormatter from "chord-plus/src/chord-plus-formatter";

export default {
  name: "View",
  props: ["id", "slug"],
  data: function() {
    return {
      song: null,
      content: ""
    };
  },
  created: function() {
    var scope = this;

    this.handlers = {
      success: function(result) {
        if (result.data) {
          scope.song = result.data;

		  var parsed = ChordPlusParser.parse(scope.song.body);
		  
          scope.content = ChordPlusFormatter.format(parsed);
        } else {
          // No hits
        }
      },
      error: function(error) {
        console.debug(error);
      }
    };
  },
  mounted: function() {
    SongsService.getSingle(this.handlers.success, this.handlers.error, this.id);
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

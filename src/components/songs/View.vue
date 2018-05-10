<template>
	<div class="index">	  	
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<router-link class="breadcrumb-item" :to="{ name: 'SongsIndex' }">Songs</router-link>
				<li class="breadcrumb-item active" aria-current="page">{{ song.title }}</li>
			</ol>
		</nav>

		<div>
			<label>Change key</label>
			<select v-model="newKey" v-on:change="transpose()">
			<option v-for="key in keys" :value="key" :key="key">{{ key }}</option>
			</select>
			<button type="button" v-on:click="reset()">Reset</button>
		</div>
		<div>{{ song.title }} <span v-if="song.artists">-</span> {{ song.artists }}</div>
		<div>
			<ul>
			<li>Key: {{ newKey || song.key }}</li>
			<li>BPM: {{ song.bpm }}</li>
			<li>Meter: {{ song.meter }}</li>
			<li v-if="song.commet">{{ song.comment }}</li>
			</ul>
		</div>
			<div v-html="content"></div>
		</div>
</template>

<script>
import SongsService from "@/services/SongsService";

export default {
  name: "SongsView",
  props: ["id", "slug"],
  data: function() {
    return {
      song: {
        title: "",
        artists: "",
        key: "",
        bpm: "",
        meter: "",
        comment: false
      },
      content: "",
      keys: [
        "C",
        "C#",
        "Db",
        "D",
        "D#",
        "Eb",
        "E",
        "F",
        "F#",
        "Gb",
        "G",
        "G#",
        "Ab",
        "A",
        "A#",
        "Bb",
        "B"
      ],
      neyKey: null
    };
  },
  created: function() {
    var scope = this;

    this.handlers = {
      success: function(result) {
        if (result.data) {
          scope.song = result.data;
          scope.content = ChordPlus.getHTML(scope.song.body);
        } else {
          scope.$emit("show-message", {
            message: "No songs matching your search. Please try again.",
            type: "info"
          });
        }
      },
      error: function(error) {
        console.debug(error);
      }
    };

    let chordPlusScript = document.createElement("script");
    chordPlusScript.setAttribute(
      "src",
      "static/vendor/chord-plus/dist/chord-plus.min.js"
    );
    document.head.appendChild(chordPlusScript);
  },
  mounted: function() {
    SongsService.getSingle(this.handlers.success, this.handlers.error, this.id);
  },
  methods: {
    transpose: function() {
      if (this.song) {
        this.content = ChordPlus.getHTML(
          this.song.body,
          this.song.key,
          this.newKey
        );
      }
    },
    reset: function() {
      if (this.song) {
        this.newKey = null;

        this.content = ChordPlus.getHTML(this.song.body, this.song.key);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

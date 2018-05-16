<template>
	<div class="index">
		<nav aria-label="breadcrumb" class="hidden-print">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link class="breadcrumb-item" :to="{ name: 'SongsIndex' }">Songs</router-link></li>				
				<li class="breadcrumb-item active" aria-current="page">{{ song.title }}</li>
			</ol>
		</nav>

		<div class="row">
			<div class="col-md-12 song-container">
				<h1 class="song-title">
					{{ song.title }} <span v-if="song.artists">-</span> {{ song.artists }}
				</h1>

				<div class="song-details">
					BPM: <span>{{ song.bpm }}</span>
					Meter: <span>{{ song.meter }}</span>
					Key: <span>{{ newKey || song.key }}</span>
					<template v-if="song.comment">Comments: <span>{{ song.comment }}</span></template>
				</div>
			</div>			
		</div>

		<div class="row hidden-print toolbar">
			<div class="col-md-12">
				<div class="input-group">
					<div class="input-group-prepend">
						<label class="input-group-text">Change key</label>
					</div>
					<select v-model="newKey" v-on:change="transpose()">
						<option v-for="key in keys" :value="key" :key="key">{{ key }}</option>
					</select>
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" type="button" @click="reset()">Reset</button>
						<button class="btn btn-outline-primary" type="button" onclick="print()">Print</button>
					</div>
				</div>
			</div>
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
      newKey: null
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
.song-container {
  font-family: "Inconsolata", monospace;
}

.song-title {
  font-size: 30px;
  margin: 0;
}
.song-details {
  border-top: solid thin black;
}

.song-details span {
  margin-right: 20px;
}

.toolbar {
  margin-top: 20px;
}

@media print {
  .hidden-print {
    display: none;
  }
}
</style>

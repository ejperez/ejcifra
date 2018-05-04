<template>
	<div class="index">
	  	<ul>
        	<li><router-link :to="{ name: 'AdminSongsIndex' }">Admin Songs</router-link></li>
        	<li>{{ song.title }}</li>			
	  	</ul>

		<form v-on:submit.prevent="save()">
			Title: <input type="text" v-model="song.title"><br>
			Artists: <input type="text" v-model="song.artists"><br>
			Key: <select v-model="song.key" name="" id=""><option v-for="key in keys" :key="key" :value="key" v-html="key"></option></select><br>
			BPM: <input type="number" v-model="song.bpm"><br>
			Body:<br><textarea v-model="song.body" cols="30" rows="10"></textarea><br>
			<button type="submit">Save</button>
		</form>
	</div>
</template>

<script>
import SongsService from "@/services/SongsService";

export default {
  name: "AdminSongsAddEdit",
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
  methods: {
    save: function() {
      console.log("saved...");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

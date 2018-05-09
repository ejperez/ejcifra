<template>
	<div class="index">
	  	<ul>
        	<li><router-link :to="{ name: 'AdminSongsIndex' }">Admin Songs</router-link></li>
        	<li v-if="id">{{ song.title }}</li>			
	  	</ul>

		<form v-on:submit.prevent="save()">
			Title: <input required type="text" v-model="song.title"><br>
			Artists: <input type="text" v-model="song.artists"><br>
			Key: <select v-model="song.key"><option v-for="key in keys" :key="key" :value="key" v-html="key"></option></select><br>
			Meter: <select v-model="song.meter"><option v-for="meter in meters" :key="meter" :value="meter" v-html="meter"></option></select><br>
			BPM: <input required type="number" v-model="song.bpm"><br>
			Comment: <input type="text" v-model="song.comment"><br>
			Body:<br><textarea required v-model="song.body" cols="30" rows="10"></textarea><br>
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
        key: "C",
        bpm: 100,
        meter: "4/4",
        comment: ""
      },
      meters: ["4/4", "3/4", "6/8"],
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
      getSuccess: function(result) {
        scope.song = result.data;
      },
      success: function(result) {
        let song = result.data;
        SongsService.removeDraft();

        if (scope.id) {
          scope.song = song;

          scope.$emit("show-message", {
            message: "Saved.",
            isSuccessMessage: true
          });
        } else {
          scope.$router.push({
            name: "AdminSongsEdit",
            params: { id: song.id, slug: song.slug }
          });
        }
      },
      error: function(error) {
        let errorMessage = error.response.data.error;

        if (errorMessage === "Unauthenticated.") {
          scope.$emit("logged-in");

          scope.$router.push({
            name: "AuthLogin",
            query: {
              redirect: scope.$route.fullPath
            }
          });
        }

        scope.$emit("show-message", {
          message: errorMessage,
          isSuccessMessage: false
        });
      }
    };
  },
  mounted: function() {
    if (this.id) {
      SongsService.getSingle(
        this.handlers.getSuccess,
        this.handlers.error,
        this.id
      );
    } else {
      let songDraft = SongsService.getDraft();

      if (songDraft) {
        this.song = JSON.parse(songDraft);
      }
    }
  },
  methods: {
    save: function() {
      SongsService.saveDraft(JSON.stringify(this.song));

      SongsService.save(
        this.handlers.success,
        this.handlers.error,
        this.id,
        this.song
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

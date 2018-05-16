<template>
	<div class="index">	  	
		<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link :to="{ name: 'AdminSongsIndex' }">Admin Songs</router-link></li>				
				<li class="breadcrumb-item active" aria-current="page">{{ song.title }}</li>
			</ol>
		</nav>

		<form v-on:submit.prevent="save()">
			<div class="form-row">
				<div class="form-group col-md-6">
					<label for="">Title</label>
					<input class="form-control" required type="text" v-model="song.title">
				</div>
				<div class="form-group col-md-6">
					<label for="">Artist(s)</label>
					<input class="form-control" type="text" v-model="song.artists">
				</div>
			</div>
			<div class="form-row">
				<div class="form-group col-md-3">
					<label for="">Key</label>
					<select class="form-control" v-model="song.key"><option v-for="key in keys" :key="key" :value="key" v-html="key"></option></select>
				</div>
				<div class="form-group col-md-3">
					<label for="">Meter</label>
					<select class="form-control" v-model="song.meter"><option v-for="meter in meters" :key="meter" :value="meter" v-html="meter"></option></select>
				</div>
				<div class="form-group col-md-3">
					<label for="">BPM</label>
					<input class="form-control" required type="number" v-model="song.bpm">
				</div>
				<div class="form-group col-md-3">
					<label for="">Comment</label>
					<input class="form-control" type="text" v-model="song.comment">
				</div>
			</div>
			<div class="form-row">
				<div class="form-group col">
					<label for="">Body</label>
					<textarea class="form-control" id="editor" required v-model="song.body" cols="30" rows="10"></textarea>
				</div>
			</div>			
			<button class="btn btn-primary" type="submit">Save</button>
		</form>

		<ul>
			<li v-for="symbol in symbols" :key="symbol"><button type="button" @click="insertToEditor(symbol)" v-html="symbol"></button></li>
		</ul>
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
      symbols: ["[", "]", "|", "/", "#", ":", "-", "_", "(", ")"],
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
            type: "success"
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
          type: "danger"
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
    },
    insertToEditor: function(symbol) {
      let editor = document.getElementById("editor");
      let selectionStartIndex = editor.selectionStart;

      editor.value =
        editor.value.substring(0, selectionStartIndex) +
        symbol +
        editor.value.substring(selectionStartIndex, editor.value.length);

      editor.selectionStart = editor.selectionEnd =
        selectionStartIndex + symbol.length;
      editor.focus();

      // To update Vue model
      editor.dispatchEvent(new Event("input"));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
	<div class="index">
		<nav class="d-none d-sm-block" aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link :to="{ name: 'AdminSongsIndex' }">Admin Songs</router-link></li>				
				<li class="breadcrumb-item active" aria-current="page">{{ song.title || 'New Song' }}</li>
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
					<div v-if="parseErrorMessage" class="alert alert-danger" role="alert"><span v-html="parseErrorMessage"></span><button @click="parseErrorMessage = null" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>

					<label for="">Body</label>
					<textarea class="form-control" id="editor" required v-model="song.body" cols="30" rows="10"></textarea>					
				</div>
			</div>
			<div class="js-toolbar-mobile-helper d-block d-sm-none">
				<div class="row">
					<div class="col-md-12 text-center">						
						<button v-for="symbol in symbols" :key="symbol" type="button" class="btn btn-outline-secondary" @click="insertToEditor(symbol)" v-html="symbol"></button>
					</div>
				</div>
			</div>
			<button class="btn btn-primary" type="submit">Save</button>
			<router-link v-if="id" class="btn btn-secondary" :to="{ name: 'SongsView', params: { id: song.id, slug: song.slug } }">View</router-link>
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
      neyKey: null,
      isEditorFocused: false,
      parseErrorMessage: null
    };
  },
  watch: {
    id: function(newId, oldId) {
      if (!newId) {
        this.song = {
          title: "",
          artists: "",
          key: "C",
          bpm: 100,
          meter: "4/4",
          comment: ""
        };
      }
    }
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
          scope.$emit("show-message", {
            message: "Saved.",
            type: "success"
          });

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
      // Check for source code errors
      try {
        ChordPlus.getHTML(this.song.body, this.song.key, this.song.key);
        this.parseErrorMessage = null;

        SongsService.saveDraft(JSON.stringify(this.song));

        SongsService.save(
          this.handlers.success,
          this.handlers.error,
          this.id,
          this.song
        );
      } catch (exception) {
        this.parseErrorMessage = exception.message;
      }
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
#editor {
  font-family: "Inconsolata", monospace;
  font-size: 18px;
  line-height: 25px;
  resize: none;
}

.js-toolbar-mobile-helper {
  margin-bottom: 30px;
  margin-top: -16px;
}
.js-toolbar-mobile-helper .buttons {
  overflow: auto;
  white-space: nowrap;
  text-align: center;
}
</style>

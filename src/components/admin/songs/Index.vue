<template>
	<div class="index">
		<h1>{{ msg }}</h1>

		<ul>
			<li><router-link :to="{ name: 'AdminSongsAdd' }">Add new</router-link></li>
		</ul>

		<form v-on:submit.prevent="search()">
			<input v-model="searchKeyword" type="text" placeholder="Title or artist name">
			<button type="submit">Search</button>
		</form>

		<ul>
			<li v-for="song in songs" :key="song.id">
				<span>{{ song.title }} <span v-if="song.artists">-</span> {{ song.artists }} {{ song.comment ? '(' + song.comment  + ')' : '' }}</span>
				<router-link :to="{ name: 'AdminSongsEdit', params: { id: song.id, slug: song.slug } }">Edit</router-link>
				<button @click="duplicate(song)" type="button">Duplicate</button>
				<button @click="remove(song)" type="button">Delete</button>
			</li>
		</ul>

		<ul>
			<li v-for="page in pages" :key="page">
				<button :disabled="currentPage === page" v-on:click="goToPage(page)" type="button">{{ page }}</button>
			</li>
		</ul>
		
	</div>
</template>

<script>
import SongsService from "@/services/SongsService";

export default {
  name: "AdminSongsIndex",
  data: function() {
    return {
      msg: "Admin Songs",
      songs: [],
      searchKeyword: "",
      pages: [],
      currentPage: 1
    };
  },
  created: function() {
    var scope = this;

    this.handlers = {
      getSuccess: function(result) {
        SongsService.save(
          scope.handlers.duplicateSuccess,
          scope.handlers.error,
          null,
          result.data
        );
      },
      duplicateSuccess: function(result) {
        let song = result.data;

        scope.$emit("show-message", {
          message: "Successfully duplicated " + song.title,
          isSuccessMessage: true
        });

        SongsService.get(this.handlers.success, this.handlers.error);
      },
      deleteSuccess: function(result) {
        scope.$emit("show-message", {
          message: result.data.message,
          isSuccessMessage: true
        });

        SongsService.get(scope.handlers.success, scope.handlers.error);
      },
      success: function(result) {
        if (result.data.data.length) {
          scope.songs = result.data.data;

          scope.pages = [];
          for (var i = 0; i < result.data.last_page; i++) {
            scope.pages.push(i + 1);
          }
        } else {
          scope.$emit("show-message", {
            message: "No songs matching your search. Please try again.",
            isSuccessMessage: true
          });
        }
      },
      error: function(error) {
        let errorMessage = error.response.data.error;

        scope.$emit("show-message", {
          message: errorMessage,
          isSuccessMessage: false
        });
      }
    };
  },
  mounted: function() {
    SongsService.get(this.handlers.success, this.handlers.error);
  },
  methods: {
    search: function() {
      if (this.searchKeyword) {
        var scope = this;

        scope.currentPage = 1;

        SongsService.get(
          this.handlers.success,
          this.handlers.error,
          scope.searchKeyword
        );
      }
    },
    goToPage: function(page) {
      var scope = this;

      scope.currentPage = page;

      SongsService.get(
        this.handlers.success,
        this.handlers.error,
        scope.searchKeyword,
        page
      );
    },
    remove: function(song) {
      if (confirm("Delete " + song.title + " ?")) {
        SongsService.delete(
          this.handlers.deleteSuccess,
          this.handlers.error,
          song.id
        );
      }
    },
    duplicate: function(song) {
      SongsService.getSingle(
        this.handlers.getSuccess,
        this.handlers.error,
        song.id
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

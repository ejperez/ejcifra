<template>
  <div class="index">
    <h1>{{ msg }}</h1>
	<input v-model="searchKeyword" type="text" placeholder="Title or artist name">
	<button v-on:click="search()" type="button">Search</button>
	<ul>
		<li v-for="song in songs">
			<router-link v-bind:to="{ name: 'View', params: { id: song.id, slug: song.slug } }">{{ song.title }} - {{ song.artists}} {{ song.comment ? '(' + song.comment  + ')' : '' }}</router-link>			
		</li>
	</ul>
	<ul>
		<li v-for="page in pages">
			<button v-bind:disabled="currentPage === page" v-on:click="goToPage(page)" type="button">{{ page }}</button>
		</li>
	</ul>
  </div>
</template>

<script>
import SongsService from "@/services/SongsService";

export default {
  name: "Index",
  data: function() {
    return {
      msg: "Songs",
      songs: [],
      searchKeyword: "",
      pages: [],
      currentPage: 1
    };
  },
  created: function() {
    var scope = this;

    this.handlers = {
      success: function(result) {
        if (result.data.data.length) {
          scope.songs = result.data.data;

          scope.pages = [];
          for (var i = 0; i < result.data.last_page; i++) {
            scope.pages.push(i + 1);
          }
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
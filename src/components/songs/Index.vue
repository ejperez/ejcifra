<template>
	<div class="index">
		<h1>{{ msg }}</h1>

		<form v-on:submit.prevent="search()">
			<div class="input-group mb-3">
				<input class="form-control" v-model="searchKeyword" type="text" placeholder="Title or artist name...">
				<div class="input-group-append">
					<button class="btn btn-outline-primary" type="submit">Search</button>
				</div>
			</div>			
		</form>

		<div class="list-group">			
			<router-link v-for="song in songs" :key="song.id" class="list-group-item list-group-item-action" :to="{ name: 'SongsView', params: { id: song.id, slug: song.slug } }">{{ song.title }} - {{ song.artists }} {{ song.comment ? '(' + song.comment  + ')' : '' }}</router-link>	
		</div>

		<nav class="pagination-container" v-if="pages.length > 1" aria-label="Pagination">
			<ul class="pagination justify-content-center">
				<li v-for="page in pages" :key="page" class="page-item" :class="{ active : currentPage === page }"><a class="page-link" @click="goToPage(page)" v-html="page"></a></li>
			</ul>
		</nav>
  </div>
</template>

<script>
import SongsService from "@/services/SongsService";

export default {
  name: "SongsIndex",
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
  },
  mounted: function() {
    SongsService.get(this.handlers.success, this.handlers.error);
  },
  methods: {
    search: function() {
      var scope = this;

      scope.currentPage = 1;

      SongsService.get(
        this.handlers.success,
        this.handlers.error,
        scope.searchKeyword
      );
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
.pagination-container {
  margin-top: 20px;
}
</style>

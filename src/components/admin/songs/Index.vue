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
			<div v-for="song in songs" :key="song.id" class="list-group-item">
				<div class="row">
					<div class="col-md-8">
						<span class="song-title">{{ song.title }} <span v-if="song.artists">-</span> {{ song.artists }} {{ song.comment ? '(' + song.comment  + ')' : '' }}</span>
					</div>
					<div class="col-md-4">
						<router-link class="btn btn-light" :to="{ name: 'SongsView', params: { id: song.id, slug: song.slug } }">View</router-link>
						<router-link class="btn btn-light" :to="{ name: 'AdminSongsEdit', params: { id: song.id, slug: song.slug } }">Edit</router-link>
						<button class="btn btn-light" @click="duplicate(song)" type="button">Duplicate</button>
						<button class="btn btn-light" @click="remove(song)" type="button">Delete</button>
					</div>
				</div>
			</div>			
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
  name: "AdminSongsIndex",
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
      duplicateSuccess: function(result) {
        let song = result.data;

        scope.$emit("show-message", {
          message: "Successfully duplicated " + song.title,
          type: "success"
        });

        SongsService.get(scope.handlers.success, scope.handlers.error);
      },
      deleteSuccess: function(result) {
        scope.$emit("show-message", {
          message: result.data.message,
          type: "success"
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
            type: "info"
          });
        }
      },
      error: function(error) {
        let errorMessage = error.response.data.error;

        scope.$emit("show-message", {
          message: errorMessage,
          type: "danger"
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
      if (confirm("Delete " + song.title + "?")) {
        SongsService.delete(
          this.handlers.deleteSuccess,
          this.handlers.error,
          song.id
        );
      }
    },
    duplicate: function(song) {
      if (confirm("Duplicate " + song.title + "?")) {
        SongsService.duplicate(
          this.handlers.duplicateSuccess,
          this.handlers.error,
          song.id
        );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination-container {
  margin-top: 20px;
}
.song-title {
  font-size: 20px;
}
</style>

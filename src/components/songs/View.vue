<template>
	<div class="index">
		<nav aria-label="breadcrumb" class="d-print-none d-none d-sm-block">
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

		<div class="row d-print-none toolbar">
			<div class="col-md-12">
				<div class="input-group">
					<div class="input-group-prepend">
						<label class="input-group-text">Change key</label>
					</div>
					<select v-model="newKey" v-on:change="transpose()">
						<option v-for="key in keys" :value="key" :key="key">{{ key }}</option>
					</select>
					<div class="input-group-append">
						<button class="btn btn-outline-secondary" type="button" @click="reset()">Reset key</button>

						<button v-if="isOnline" class="btn btn-outline-secondary" type="button" @click="saveOffline()">Save offline</button>
						<button v-else class="btn btn-outline-secondary" type="button" @click="removeOffline()">Remove offline copy</button>

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
import OfflineSongsService from "@/services/OfflineSongsService";

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
      isOnline: true,
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

          if (scope.$route.query.hasOwnProperty("key")) {
            scope.newKey = scope.$route.query.key;
            scope.transpose();
          } else {
            try {
              scope.content = ChordPlus.getHTML(
                scope.song.body,
                scope.song.key,
                scope.song.key
              );
            } catch (exception) {
              scope.$emit("show-message", {
                message: exception.message,
                type: "danger"
              });
            }
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

        // Get offline versions
        scope.isOnline = false;
        scope.song = OfflineSongsService.getSingle(scope.id);

        if (!scope.song) {
          scope.$emit("show-message", {
            message: "Offline version not available.",
            type: "danger"
          });

          scope.$router.push({
            name: "SongsIndex"
          });

          return;
        }

        try {
          scope.content = ChordPlus.getHTML(
            scope.song.body,
            scope.song.key,
            scope.song.key
          );
        } catch (exception) {
          scope.$emit("show-message", {
            message: exception.message,
            type: "danger"
          });
        }
      }
    };
  },
  mounted: function() {
    var scope = this;
    var interval = setInterval(function() {
      if (typeof ChordPlus !== "undefined") {
        SongsService.getSingle(
          scope.handlers.success,
          scope.handlers.error,
          scope.id
        );
        clearInterval(interval);
      }
    }, 200);
  },
  methods: {
    transpose: function() {
      if (this.song) {
        try {
          this.content = ChordPlus.getHTML(
            this.song.body,
            this.song.key,
            this.newKey
          );
        } catch (exception) {
          scope.$emit("show-message", {
            message: exception.message,
            type: "danger"
          });
        }

        this.$router.push({
          name: "SongsView",
          params: {
            id: this.song.id,
            slug: this.song.slug
          },
          query: {
            key: this.newKey
          }
        });
      }
    },
    reset: function() {
      if (this.song) {
        this.newKey = null;

        try {
          this.content = ChordPlus.getHTML(
            this.song.body,
            this.song.key,
            this.song.key
          );
        } catch (exception) {
          scope.$emit("show-message", {
            message: exception.message,
            type: "danger"
          });
        }

        this.$router.push({
          name: "SongsView",
          params: {
            id: this.song.id,
            slug: this.song.slug
          }
        });
      }
    },
    saveOffline: function() {
      OfflineSongsService.save(this.song.id, this.song);

      this.$emit("show-message", {
        message: "Song saved offline.",
        type: "info"
      });
    },
    removeOffline: function() {
      OfflineSongsService.delete(this.song.id);

      this.$emit("show-message", {
        message: "Offline version removed.",
        type: "info"
      });

      this.$router.push({
        name: "SongsIndex"
      });
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
</style>

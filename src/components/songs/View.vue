<template>
	<div class="index">	
		<div class="row">
			<div class="col song-container">
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

		<div class="row">
			<div class="col d-print-none toolbar">
				<div class="input-group">
					<select class="custom-select" v-model="newKey" v-on:change="transpose()" title="Change key">
						<option v-for="key in keys" :value="key.value" :key="key.value">{{ key.label }}</option>
					</select>
					<div class="input-group-append">
						<button v-if="isOnline" class="btn btn-outline-secondary" type="button" @click="saveOffline()" title="Save offline">
							<font-awesome-icon icon="save" />
						</button>
						<button v-else class="btn btn-outline-secondary" type="button" @click="removeOffline()" title="Remove offline copy">
							<font-awesome-icon icon="trash-alt" />
						</button>

						<button class="btn btn-outline-primary" type="button" onclick="print()" title="Print">
							<font-awesome-icon icon="print" />
						</button>
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
import AuthService from "@/services/AuthService";

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
      user: null,
      isOnline: true,
      content: "",
      keys: [
        { value: "C", label: "C" },
        { value: "C#", label: "C#" },
        { value: "Db", label: "Db" },
        { value: "D", label: "D" },
        { value: "D#", label: "D#" },
        { value: "Eb", label: "Eb" },
        { value: "E", label: "E" },
        { value: "F", label: "F" },
        { value: "F#", label: "F#" },
        { value: "Gb", label: "Gb" },
        { value: "G", label: "G" },
        { value: "G#", label: "G#" },
        { value: "Ab", label: "Ab" },
        { value: "A", label: "A" },
        { value: "A#", label: "A#" },
        { value: "Bb", label: "Bb" },
        { value: "B", label: "B" }
      ],
      newKey: null
    };
  },
  created: function() {
    var scope = this;
    this.user = AuthService.getLoggedInUser();

    this.handlers = {
      success: function(result) {
        if (result.data) {
          scope.song = result.data;
          scope.setOriginalKey();

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
        scope.setOriginalKey();

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
    setOriginalKey: function() {
      var scope = this;

      this.keys.forEach(function(item, index) {
        if (item.value === scope.song.key) {
          scope.keys[index].label = item.value + " (Original key)";
        }
      });

      this.newKey = scope.song.key;
    },
    transpose: function() {
      if (this.song) {
        try {
          this.content = ChordPlus.getHTML(
            this.song.body,
            this.song.key,
            this.newKey
          );
        } catch (exception) {
          this.$emit("show-message", {
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
<template>
  <div class="index">
    <h1>{{ msg }}</h1>
	<ul>
		<li v-for="song in songs">{{ song.title }} - {{ song.artists}}</li>
	</ul>
  </div>
</template>

<script>
import SongsService from "../services/SongsService";

export default {
  name: "Index",
  data() {
    return {
      msg: "Songs",
      songs: []
    };
  },
  mounted() {
    var scope = this;

    SongsService.get(
      function(result) {
        if (result.data.data.length) {
          scope.songs = result.data.data;
		}
      },
      function(error) {
        console.debug(error);
      }
    );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

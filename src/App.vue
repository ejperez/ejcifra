<template>
  <div id="app">
	  <div v-if="user">{{ user.name }} | <button v-on:click="logout()" type="button">Log out</button></div>
	  <div v-else><router-link v-bind:to="{ name: 'AuthLogin' }">Log in</router-link></div>
    <router-view/>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  name: "App",
  data: {
    user: null
  },
  created: function() {
    var scope = this;
    this.user = AuthService.getLoggedInUser();

    this.handlers = {
      success: function(result) {
        scope.user = null;
        scope.$router.push({ name: "SongsIndex" });
      },
      error: function(error) {
        console.debug(error);
      }
    };
  },
  methods: {
    logout: function() {
      AuthService.logout(this.handlers.success, this.handlers.error);
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

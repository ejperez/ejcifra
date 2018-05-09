<template>
	<div id="app">
		<div v-if="user">{{ user.name }} | <button v-on:click="logout()" type="button">Log out</button></div>
		<div v-else><router-link :to="{ name: 'AuthLogin' }">Log in</router-link></div>

		<div v-if="message" :class="{ success: isSuccessMessage, error: !isSuccessMessage }" v-html="message"></div>
		
		<router-view @show-message="showMessage" @logged-in="updateAuthUser"/>
	</div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  name: "App",
  data: function() {
    return {
      user: null,
      message: false,
      isSuccessMessage: true
    };
  },
  created: function() {
    var scope = this;
    this.user = AuthService.getLoggedInUser();

    this.handlers = {
      success: function(result) {
        scope.user = AuthService.getLoggedInUser();
        scope.$router.push({ name: "SongsIndex" });
      },
      error: function(error) {
        console.debug(error);
      }
    };
  },
  methods: {
    updateAuthUser: function() {
      this.user = AuthService.getLoggedInUser();
    },
    logout: function() {
      AuthService.logout(this.handlers.success, this.handlers.error);
    },
    showMessage: function(args) {
      var scope = this;
      this.message = args.message;
      this.isSuccessMessage = args.isSuccessMessage;

      setTimeout(function() {
        scope.message = false;
        scope.isSuccessMessage = true;
      }, 5000);
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

.success {
  color: green;
}

.error {
  color: red;
}
</style>

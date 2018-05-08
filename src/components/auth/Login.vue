<template>
	<div class="index">
		<h1>Log in</h1>
		<ul>
        	<li><router-link :to="{ name: 'SongsIndex' }">Songs</router-link></li>
        </ul>
		<form v-on:submit.prevent="login()">
			<input placeholder="Email" type="text" v-model="email">
			<input placeholder="Password" type="password" v-model="password">
			<button type="submit">Log in</button>
		</form>	
	</div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  name: "AuthLogin",
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  created: function() {
    var scope = this;

    this.handlers = {
      success: function(result) {
        scope.$emit("logged-in");

        if (scope.$route.query.hasOwnProperty("redirect")) {
          scope.$router.push({ path: scope.$route.query.redirect });
        } else {
          scope.$router.push({ name: "AdminSongsIndex" });
        }
      },
      error: function(error) {
        console.debug(error);
      }
    };
  },
  mounted: function() {},
  methods: {
    login: function() {
      if (this.email && this.password) {
        AuthService.login(
          this.handlers.success,
          this.handlers.error,
          this.email,
          this.password
        );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
	<div class="index text-center">
		<form class="form-login" v-on:submit.prevent="login()">
			<h1 class="h3 mb-3 font-weight-normal">Log in</h1>
			<label for="inputEmail" class="sr-only">Email address</label>
			<input type="email" id="inputEmail" class="form-control" placeholder="Email address" required="" autofocus="" v-model="email">
			<label for="inputPassword" class="sr-only">Password</label>
			<input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" v-model="password">
			<button class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
			<p class="mt-5 mb-3 text-muted">© 2018</p>
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
        let errorMessage = error.response.data.error;

        scope.$emit("show-message", {
          message: errorMessage,
          type: "danger"
        });
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
.form-login {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-login input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.form-login input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>

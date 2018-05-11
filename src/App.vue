<template>
	<div id="app">		

		<nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
			<a class="navbar-brand" href="#">ejcifra</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ml-auto">
					<li class="nav-item"></li>
					<li class="nav-item"></li>
					<template v-if="user">
						<li class="nav-item">
							<a class="nav-link disabled" href="#" v-html="user.name"></a>
						</li>
						<li class="nav-item">
							<a @click="logout()" class="nav-link" href="#">Log out</a>
						</li>
					</template>
					<template v-else>
						<li class="nav-item">
							<router-link class="nav-link" :to="{ name: 'AuthLogin' }">Log in</router-link>
						</li>
					</template>
				</ul>
			</div>
		</nav>		

		<div v-if="showProgress" id="overlay">
			<div class="progress">
				<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
			</div>
		</div>

		<div v-if="message" :class="alertClass" role="alert"><span v-html="message"></span><button @click="hideAlert" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>

		<div class="container-fluid">
			<router-view @show-message="showMessage" @logged-in="updateAuthUser"/>
		</div>
	</div>
</template>

<script>
import AuthService from "@/services/AuthService";
import "bootstrap/dist/css/bootstrap.css";

export default {
  name: "App",
  computed: {
    alertClass: function() {
      return "alert alert-dismissible fade show alert-" + this.messageType;
    }
  },
  data: function() {
    return {
      user: null,
      message: false,
      messageType: "success",
      showProgress: false
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

    let bsnScript = document.createElement("script");
    bsnScript.setAttribute(
      "src",
      "static/vendor/bootstrap.native/dist/bootstrap-native-v4.min.js"
    );
    document.head.appendChild(bsnScript);

    // Attach progress bar visibility to axios
    window.axios.interceptors.request.use(
      function(config) {
        scope.showProgress = true;
        return config;
      },
      function(error) {
        scope.showProgress = false;
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function(response) {
        scope.showProgress = false;
        return response;
      },
      function(error) {
        scope.showProgress = false;
        return Promise.reject(error);
      }
    );
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
      this.messageType = args.type;

      setTimeout(function() {
        scope.message = false;
        scope.messageType = "success";
      }, 10000);
    },
    hideAlert: function() {
      this.message = false;
    },
    progress: function(showProgress) {
      this.showProgress = showProgress;
    }
  }
};
</script>

<style scoped>
#overlay {
  position: fixed;
  background: white;
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  z-index: 999;
}
.progress {
  position: fixed;
  width: 80%;
  top: 50%;
  left: 10%;
}
</style>

<style>
.breadcrumb {
  margin-top: 20px;
}
</style>

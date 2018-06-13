<template>
	<div id="app">
		<nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
			<router-link class="navbar-brand" :to="{ name: 'SongsIndex' }">
				<img src="static/icons/Icon-36.png" width="36" height="36" alt="">
				<span>EJCIFRA</span>
			</router-link>

			<button id="hamburger" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav ml-auto">
					<template v-if="user">
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Songs</a>
							<div class="dropdown-menu" aria-labelledby="navbarDropdown">
								<router-link class="dropdown-item" :to="{ name: 'AdminSongsIndex' }">View All</router-link>
								<router-link class="dropdown-item" :to="{ name: 'AdminSongsAdd' }">Add New</router-link>
							</div>
						</li>
						<li class="nav-item dropdown">
							<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Welcome, {{ user.name }}</a>
							<div class="dropdown-menu" aria-labelledby="navbarDropdown">
								<a @click="logout()" class="dropdown-item" href="#">Log out</a>
							</div>
						</li>						
					</template>
					<template v-else>
						<li class="nav-item">
							<router-link class="nav-link" :to="{ name: 'SongsIndex' }">Songs</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" :to="{ name: 'AuthLogin' }">Log in</router-link>
						</li>
					</template>
				</ul>
			</div>
		</nav>		

		<div v-if="showProgress" id="overlay">
			<div class="loader">Loading...</div>
		</div>

		<div v-if="message" :class="alertClass" role="alert"><span v-html="message"></span><button @click="message = null" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>

		<div class="container-fluid">
			<router-view @show-message="showMessage" @logged-in="updateAuthUser"/>
		</div>
	</div>
</template>

<script>
import AuthService from "@/services/AuthService";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

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
        scope.updateAuthUser();
        scope.$router.push({ name: "AuthLogin" });
      }
    };

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
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        return response;
      },
      function(error) {
        scope.showProgress = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        return Promise.reject(error);
      }
    );

    // include ChordPlus
    let chordPlusScript = document.createElement("script");
    chordPlusScript.setAttribute(
      "src",
      "static/vendor/chord-plus/dist/chord-plus.min.js"
    );
    document.head.appendChild(chordPlusScript);
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
  z-index: 1020;
}
.loader {
  color: #00acac;
  font-size: 20px;
  margin: 100px auto;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: fixed;
  top: 35%;
  left: 50%;
  text-indent: -9999em;
  -webkit-animation: load4 1.3s infinite linear;
  animation: load4 1.3s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
@-webkit-keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em,
      0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em,
      0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
@keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0,
      0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em,
      0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em,
      0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em,
      0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
</style>

<style>
.breadcrumb {
  margin-top: 20px;
}
</style>

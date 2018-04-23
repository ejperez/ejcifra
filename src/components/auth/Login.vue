<template>
  <div class="index">
    <h1>Login</h1>	
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  name: "Login",
  data: function() {
    return {};
  },
  created: function() {
    var scope = this;

    this.handlers = {
      success: function(result) {},
      error: function(error) {
        console.debug(error);
      }
    };
  },
  mounted: function() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

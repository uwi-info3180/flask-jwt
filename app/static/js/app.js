/* Add your Application JavaScript */
const { createApp, ref } = Vue

const app = Vue.createApp({
  setup() {
    const result = ref("The result will appear here.");
    const token = ref("");
    const tasks = ref([]);
    const error = ref(false);

    // Usually the generation of a JWT will be done when a user either registers
    // with your web application or when they login.
    function getToken() {
      fetch("/token")
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          let jwt_token = response.data.token;

          // We store this token in localStorage so that subsequent API requests
          // can use the token until it expires or is deleted.
          localStorage.setItem("token", jwt_token);
          console.info("Token generated and added to localStorage.");
          token.value = jwt_token;
        });
    }

    // Remove token stored in localStorage.
    // Usually you will remove it when a user logs out of your web application
    // or if the token has expired.
    function removeToken() {
      localStorage.removeItem("token");
      console.info("Token removed from localStorage.");
      alert("Token removed!");
    }

    function getSecure() {
      let self = this;
      fetch("/api/secure", {
        headers: {
          // Try it with the `Basic` schema and you will see it gives an error message.
          // 'Authorization': 'Basic ' + localStorage.getItem('token')

          // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          let alert = document.querySelector(".alert");
          alert.classList.remove("alert-info", "alert-danger");
          alert.classList.add("alert-success");

          if (response.data) {
            let resultData = response.data;
            // successful response
            result.value = `Congrats! You have now made a successful request with a JSON Web Token. Name is: ${resultData.user.name}.`;
          } else {
            let alert = document.querySelector(".alert");
            alert.classList.remove("alert-info");
            alert.classList.add("alert-danger");

            // unsuccessful response (ie. there was an error)
            result.value = `There was an error. ${response.description}`;
          }
        })
        .catch(function (error) {
          let alert = document.querySelector(".alert");
          alert.classList.remove("alert-info");
          alert.classList.add("alert-danger");
          // unsuccessful response (ie. there was an error)
          result.value = `There was an error.`;
        });
    }
    // Visit the unsecure route which doesn't need a JWT token or
    // Authorization header
    function getUnsecure() {
      // let self = this;
      fetch("/api/unsecure")
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          let resultData = response.data;
          let alert = document.querySelector(".alert");
          alert.classList.remove("alert-danger");
          alert.classList.add("alert-info");
          result.value = `You visited the unsecure route that didn't require a JSON Web Token. Name is: ${resultData.user.name}.`;
          console.log(result.value);
        });
    }

    function getTasks() {
      let self = this;
      fetch(
        "/api/tasks",
        {
            'headers': {
                // Try it with the `Basic` schema and you will see it gives an error message.
                // 'Authorization': 'Basic ' + localStorage.getItem('token')

                // JWT requires the Authorization schema to be `Bearer` instead of `Basic`
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.tasks) {
            console.log(data.tasks);
            tasks.value = data.tasks;
            error.value = false;
          } else {
            error.value = `Error getting tasks. ${data.description}`;
            tasks.value = [];
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    return {
      result,
      token,
      tasks,
      error,
      getSecure,
      getUnsecure,
      getTasks,
      getToken,
      removeToken
    };
  }
});

app.mount("#jwtDemo");

/* Add your Application JavaScript */
const app = Vue.createApp({
  data() {
    return {
      result: "The result will appear here.",
      token: "",
      tasks: [],
      error: false,
    };
  },
  methods: {
    // Usually the generation of a JWT will be done when a user either registers
    // with your web application or when they login.
    getToken() {
      let self = this;

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
          self.token = jwt_token;
        });
    },
    // Remove token stored in localStorage.
    // Usually you will remove it when a user logs out of your web application
    // or if the token has expired.
    removeToken() {
      localStorage.removeItem("token");
      console.info("Token removed from localStorage.");
      alert("Token removed!");
    },
    getSecure() {
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
            let result = response.data;
            // successful response
            self.result = `Congrats! You have now made a successful request with a JSON Web Token. Name is: ${result.user.name}.`;
          } else {
            let alert = document.querySelector(".alert");
            alert.classList.remove("alert-info");
            alert.classList.add("alert-danger");

            // unsuccessful response (ie. there was an error)
            self.result = `There was an error. ${response.description}`;
          }
        })
        .catch(function (error) {
          let alert = document.querySelector(".alert");
          alert.classList.remove("alert-info");
          alert.classList.add("alert-danger");
          // unsuccessful response (ie. there was an error)
          self.result = `There was an error.`;
        });
    },
    // Visit the unsecure route which doesn't need a JWT token or
    // Authorization header
    getUnsecure() {
      let self = this;
      fetch("/api/unsecure")
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          let result = response.data;
          let alert = document.querySelector(".alert");
          alert.classList.remove("alert-danger");
          alert.classList.add("alert-info");
          self.result = `You visited the unsecure route that didn't require a JSON Web Token. Name is: ${result.user.name}.`;
        });
    },
    getTasks() {
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
            self.tasks = data.tasks;
            self.error = false;
          } else {
            self.error = `Error getting tasks. ${data.description}`;
            self.tasks = [];
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
  },
});

app.mount("#jwtDemo");

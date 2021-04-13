const bcrypt = require("bcrypt");

bcrypt
  .compare(
    "123456",
    "$2b$10$EfMtQsISii0vkhIFe30UauGHUt2b4zCwJ/K6APE02eQqyC8GlDNfi"
  )
  .then(function (result) {
    console.log(result);
  });

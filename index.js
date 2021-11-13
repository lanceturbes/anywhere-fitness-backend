const server = require("./api/server")
const { PORT } = require("./config")

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`)
})

const testUsers = [
  {
    username: "waywardpooch",
    password: "$2a$06$.4r3PePLFK8Zb7IFO/nMZeD5h9sREt3MKx4ZeutolzD.PytL3ArLO",
    email: "waywardpooch@signalfocused.com",
    first_name: "Wayward",
    last_name: "Pooch",
    role_id: 2
  },
  {
    username: "johnsnow",
    password: "$2a$06$R/axjKH17tjq.o0ptLj8XuZwwA/twX.M9Z2Gh.Ij1MyYaPyU2S0nS",
    email: "johnsnow@castleblack.com",
    first_name: "John",
    last_name: "Snow",
    role_id: 2
  },
  {
    username: "thorinoakenshield",
    password: "$2a$06$yXnr8JSs12elY1zR.BefAeIcixSrKDbJFd3siM4SXGI8x8cAEORau",
    email: "thorin@mistymountain.com",
    first_name: "Thorin",
    last_name: "Oakenshield"
  }
]

function seed(knex) {
  return knex("users").insert(testUsers)
}

module.exports = { seed, testUsers }

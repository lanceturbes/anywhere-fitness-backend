const testUsers = [
  {
    first_name: "Dazzling",
    last_name: "Chipmunk",
    username: "dazzlingchipmunk47",
    password: "$2a$06$GfErog3fttv4jBib2ME2duvYcWsVEO9/FMTFUlqSOS3YY6IHR0Ot.",
    email: "dazzlingchipmunk47@gmail.com"
  },
  {
    first_name: "Hypnotic",
    last_name: "Peccary",
    username: "hypnoticpeccary22",
    password: "$2a$06$XTlSyY0ZkWTxSUaMPemKaO0snqrCoxMWL5THHXU2XiIwb7ejHEWJO",
    email: "hypnoticpeccary22@gmail.com"
  },
  {
    first_name: "Secretive",
    last_name: "Chinchilla",
    username: "secretivechinchilla94",
    password: "$2a$06$Iv4W5vUSZL/4dYd6hiv6DOMqQwLxvnE4XCxxFP.DfwNA7rqMf6Ehy",
    email: "secretivechinchilla94@gmail.com"
  }
]

function seed(knex) {
  return knex("users").insert(testUsers)
}

module.exports = { seed, testUsers }

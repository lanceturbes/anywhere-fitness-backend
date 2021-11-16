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
  },
  {
    first_name: "John",
    last_name: "Snow",
    username: "johnsnow",
    password: "$2a$06$lZzzKPa4OrZn9Exm76tSxetvSa1Or6Gda4phhSGTClHQ6gEVWaTNu",
    email: "johnsnow@castleblack.com"
  },
  {
    first_name: "Mario",
    last_name: "DaPlumber",
    username: "mariodaplumber",
    password: "$2a$06$3dxJLwbN.xuCS.n3u/2Ah.x55P6KX/bar7dmvJ9W30..fXwvz7nhW",
    email: "mario@plumbers.org"
  }
]

function seed(knex) {
  return knex("users").insert(testUsers)
}

module.exports = { seed, testUsers }

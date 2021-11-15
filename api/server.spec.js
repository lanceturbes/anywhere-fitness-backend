const request = require("supertest")

const server = require("./server")
const db = require("../data/db-config")
const { testUsers } = require("../data/seeds-testing/002-users")

// Wipe the test database before running any of the tests
beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

test("sanity check", () => {
  expect(true).toBe(true)
  expect(5 + 2).toBe(7)
})

it("is using the testing environment", async () => {
  expect(process.env.NODE_ENV).toBe("testing")
})

describe("[POST] /api/auth/register", () => {
  function register(registration) {
    return request(server).post("/api/auth/register").send(registration)
  }

  async function registerAndCheck(responseProp, expectedVal, regInfo) {
    const res = await register(regInfo)
    if (responseProp === "status") {
      expect(res.status).toBe(expectedVal)
    } else if (responseProp === "message") {
      expect(res.body.message).toMatch(expectedVal)
    } else {
      throw "invalid responseProp passed into registerAndCheck()"
    }
  }

  describe("success", () => {
    let registration
    beforeEach(() => {
      registration = {
        first_name: "Ulfric",
        last_name: "Stormcloak",
        username: "stormcloak",
        password: "jarl-of-windhelm",
        email: "highking@windhelm.net",
        emailConfirm: "highking@windhelm.net"
      }
    })

    it("responds with status code 201 upon valid registration", async () => {
      await registerAndCheck("status", 201, registration)
    })

    it("returns a success message and the newly created user", async () => {
      const expectedMessage = /new user registered, successfully/i
      const expectedUser = {
        name: registration.first_name + " " + registration.last_name,
        username: registration.username,
        email: registration.email
      }

      const res = await register(registration)
      const actualMessage = res.body.message
      const actualUser = res.body.user

      expect(actualMessage).toMatch(expectedMessage)
      expect(actualUser).toMatchObject(expectedUser)
    })
  })

  describe("failure", () => {
    it("responds with status code 400 when registration info is invalid", async () => {
      const registration = { username: "" }
      await registerAndCheck("status", 400, registration)
    })

    describe("name error messages", () => {
      let registration
      beforeEach(() => {
        registration = {
          first_name: "",
          last_name: "",
          username: "stormcloak",
          password: "jarl-of-windhelm",
          email: "highking@windhelm.net",
          emailConfirm: "highking@windhelm.net"
        }
      })

      it("returns 'first name is required' when first name is missing", async () => {
        const expectedMessage = /first name is required/i
        registration.last_name = "Stormcloak"
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'last name is required' when last name is missing", async () => {
        const expectedMessage = /last name is required/i
        registration.first_name = "Ulfric"
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'invalid first name' when too short/long", async () => {
        const expectedMessage = /invalid first name/i
        registration.last_name = "Stormcloak"

        registration.first_name = "ab"
        await registerAndCheck("message", expectedMessage, registration)

        registration.first_name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah!"
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'invalid last name' when too short/long", async () => {
        const expectedMessage = /invalid last name/i
        registration.first_name = "Ulfric"

        registration.last_name = "ab"
        await registerAndCheck("message", expectedMessage, registration)

        registration.last_name = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaah!"
        await registerAndCheck("message", expectedMessage, registration)
      })
    })

    describe("username error messages", () => {
      let registration
      beforeEach(() => {
        registration = {
          first_name: "Ulfric",
          last_name: "Stormcloak",
          username: "",
          password: "jarl-of-windhelm",
          email: "highking@windhelm.net",
          emailConfirm: "highking@windhelm.net"
        }
      })

      it("returns 'username is required' when username is missing", async () => {
        const expectedMessage = /username is required/i
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'username must be 6 characters or longer' when username is too short", async () => {
        const expectedMessage = /username must be 6 characters or longer/i
        registration.username = "short"
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'username must be shorter than 32 characters' when username is too long", async () => {
        const expectedMessage = /username must be shorter than 32 characters/i
        registration.username = "thisusernameiswaaaaaaaaaaaaaaaaaaaaaaaaytoolong"
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'username taken' when username already in use", async () => {
        const expectedMessage = /username taken/i
        registration.username = "secretivechinchilla94"
        await registerAndCheck("message", expectedMessage, registration)
      })
    })

    describe("password error messages", () => {
      let registration
      beforeEach(() => {
        registration = {
          username: "sheogorath",
          password: "",
          email: "sheogorath@shiveringisles.net",
          emailConfirm: "sheogorath@shiveringisles.net"
        }
      })

      it("returns 'password is required' when password is missing", async () => {
        const expectedMessage = /password is required/i
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'password must be 8 characters or longer' when password is too short", async () => {
        const expectedMessage = /password must be 8 characters or longer/i
        registration.password = "short"
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'password must be shorter than 64 characters' when password is too long", async () => {
        const expectedMessage = /password must be shorter than 64 characters/i
        registration.password = "waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaytooooooooooooolong"
        await registerAndCheck("message", expectedMessage, registration)
      })
    })

    describe("email error messages", () => {
      let registration
      beforeEach(() => {
        registration = {
          username: "sheogorath",
          password: "TH3_M4D_PR1NC3",
          email: "",
          emailConfirm: ""
        }
      })

      it("returns 'email is required' when email is missing", async () => {
        const expectedMessage = /email is required/i
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'email is invalid' when email is in invalid format", async () => {
        const expectedMessage = /email is invalid/i
        registration.email = "sheogorath"
        registration.emailConfirm = "sheogorath"
        await registerAndCheck("message", expectedMessage, registration)
      })
    })

    describe("email confirmation error messages", () => {
      it("returns 'emails must match' when email/emailConfirm don't match", async () => {
        const expectedMessage = /emails must match/i
        const registration = {
          username: "sheogorath",
          password: "TH3_M4D_PR1NC3",
          email: "sheogorath@shiveringisles.net",
          emailConfirm: "notmatching"
        }
        await registerAndCheck("message", expectedMessage, registration)
      })
    })
  })
})

describe("[POST] /api/auth/login", () => {
  function login(user) {
    return request(server).post("/api/auth/login").send(user)
  }

  async function loginAndCheck(responseProp, expectedVal, loginInfo) {
    const res = await login(loginInfo)
    if (responseProp === "status") {
      expect(res.status).toBe(expectedVal)
    } else if (responseProp === "message") {
      expect(res.body.message).toMatch(expectedVal)
    } else {
      throw "invalid responseProp passed into loginAndCheck()"
    }
  }

  describe("success", () => {
    let loginInfo
    beforeEach(() => {
      loginInfo = {
        username: "secretivechinchilla94",
        password: "secretivechinchilla94"
      }
    })

    it("responds with status code 200 upon successful login", async () => {
      await loginAndCheck("status", 200, loginInfo)
    })

    it("returns a welcome message and a login token", async () => {
      const expectedMessage = /welcome, secretivechinchilla94/i
      const res = await login(loginInfo)
      expect(res.body.message).toMatch(expectedMessage)
      expect(res.body).toHaveProperty("token")
    })
  })

  describe("failure", () => {
    it(`responds with status code 400 when credentials are invalid`, async () => {
      const credentials = { username: "willie-wonka", password: "badwrong" }
      await loginAndCheck("status", 400, credentials)
    })

    it("returns message 'username is required' when username is missing", async () => {
      const expectedMessage = /username is required/i
      const credentials = { password: "badwrong" }
      await loginAndCheck("message", expectedMessage, credentials)
    })

    it("returns message 'password is required' when password is missing", async () => {
      const expectedMessage = /password is required/i
      const credentials = { username: "willie-wonka" }
      await loginAndCheck("message", expectedMessage, credentials)
    })

    it("returns message 'invalid credentials' when credentials are bad", async () => {
      const expectedMessage = /invalid credentials/i
      const credentials = { username: "willie-wonka", password: "badwrong" }
      await loginAndCheck("message", expectedMessage, credentials)
    })
  })
})

describe("[GET] /api/users", () => {
  let res
  beforeAll(async () => {
    res = await request(server).get("/api/users")
  })

  it("responds with status code 200", async () => {
    const expected = 200
    const actual = res.status
    expect(actual).toBe(expected)
  })

  it("returns an array of all currently registered users", async () => {
    const expected = testUsers.map((user) => {
      return {
        name: user.first_name + " " + user.last_name,
        email: user.email,
        username: user.username
      }
    })
    const actual = res.body
    expect(actual).toMatchObject(expected)
  })
})

describe("[GET] /api/users/:id", () => {
  describe("success", () => {
    it("responds with status code 200", async () => {
      const expected = 200
      const res = await request(server).get("/api/users/2")
      const actual = res.status
      expect(actual).toBe(expected)
    })

    it("returns an object with user data", async () => {
      const expected = {
        name: testUsers[1].first_name + " " + testUsers[1].last_name,
        email: testUsers[1].email,
        username: testUsers[1].username,
        user_id: 2
      }
      const res = await request(server).get("/api/users/2")
      const actual = res.body
      expect(actual).toMatchObject(expected)
    })
  })

  describe("failure", () => {
    it("responds with status code 404", async () => {
      const expected = 404
      const res = await request(server).get("/api/users/100")
      const actual = res.status
      expect(actual).toBe(expected)
    })

    it("returns message 'user does not exist' when ID is invalid", async () => {
      const expected = /user does not exist/i
      const res = await request(server).get("/api/users/100")
      const actual = res.body.message
      expect(actual).toMatch(expected)
    })
  })
})

describe("[GET] /api/classes", () => {
  it("responds with status code 200", async () => {
    const expected = 200
    const res = await request(server).get("/api/classes")
    const actual = res.status
    expect(actual).toBe(expected)
  })
  it("returns an array of all current classes", async () => {
    const expected = [
      {
        class_id: 1,
        instructor: "John Snow",
        name: "Castle Black Combat",
        type: "Strength",
        start_time: "05:00",
        duration: 120,
        intensity: "high",
        location: "The Wall",
        attendees: 47,
        max_class_size: 64
      },
      {
        class_id: 2,
        instructor: "Mario",
        name: "Mario's Run",
        type: "Endurance",
        start_time: "07:00",
        duration: 80,
        intensity: "medium",
        location: "Koopa Troopa Beach",
        attendees: 14,
        max_class_size: 32
      }
    ]
    const res = await request(server).get("/api/classes")
    const actual = res.body
    expect(actual).toEqual(expected)
  })
})

describe("[GET] /api/classes/:id", () => {
  describe("success", () => {
    it("responds with status code 200", async () => {
      const expected = 200
      const res = await request(server).get("/api/classes/2")
      const actual = res.status
      expect(actual).toBe(expected)
    })
    it("returns fitness class object of the given ID", async () => {
      const expected = {
        class_id: 2,
        instructor: "Mario",
        name: "Mario's Run",
        type: "Endurance",
        start_time: "07:00",
        duration: 80,
        intensity: "medium",
        location: "Koopa Troopa Beach",
        attendees: 14,
        max_class_size: 32
      }
      const res = await request(server).get("/api/classes/2")
      const actual = res.body
      expect(actual).toEqual(expected)
    })
  })

  describe("failure", () => {
    it("responds with status code 404", async () => {
      const expected = 404
      const res = await request(server).get("/api/classes/300")
      const actual = res.status
      expect(actual).toBe(expected)
    })

    it("returns message 'class not found'", async () => {
      const expected = /class not found/i
      const res = await request(server).get("/api/classes/300")
      const actual = res.body.message
      expect(actual).toMatch(expected)
    })
  })
})

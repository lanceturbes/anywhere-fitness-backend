const request = require("supertest")

const server = require("./server")
const db = require("../data/db-config")
const { testUsers } = require("../data/seeds/005-users")
const { testClasses } = require("./fitness-classes/test-classes")
const { TEST_PASSWORD } = require("../config")

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

function login(user) {
  return request(server).post("/api/auth/login").send(user)
}

function register(registration) {
  return request(server).post("/api/auth/register").send(registration)
}

describe("[POST] /api/auth/register", () => {
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
        email: "highking@windhelm.net"
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
        registration.username = "johnsnow"
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
        }
      })

      it("returns 'email is required' when email is missing", async () => {
        const expectedMessage = /email is required/i
        await registerAndCheck("message", expectedMessage, registration)
      })

      it("returns 'email is invalid' when email is in invalid format", async () => {
        const expectedMessage = /email is invalid/i
        registration.email = "sheogorath"
        await registerAndCheck("message", expectedMessage, registration)
      })
    })
  })
})

describe("[POST] /api/auth/login", () => {
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
        username: "johnsnow",
        password: TEST_PASSWORD
      }
    })

    it("responds with status code 200 upon successful login", async () => {
      await loginAndCheck("status", 200, loginInfo)
    })

    it("returns a welcome message and a login token", async () => {
      const expectedMessage = /welcome, johnsnow/i
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
    const expected = testUsers.map((user, index) => {
      return {
        id: index + 1,
        name: `${user.first_name} ${user.last_name}`,
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
      const usr = testUsers[1]
      const expected = {
        id: 2,
        name: `${usr.first_name} ${usr.last_name}`,
        username: usr.username,
        email: usr.email,
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
    const expected = testClasses
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
        attendees: 16,
        duration: 40,
        id: 2,
        instructor: "Wayward Pooch",
        intensity: "medium",
        location: "Koopa Troopa Beach",
        max_class_size: 32,
        name: "Pooch's Run",
        start_time: "10:00:00",
        type: "endurance"
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

describe("[POST] /api/classes", () => {
  let credentials
  let token
  beforeEach(async () => {
    credentials = {
      username: "johnsnow",
      password: TEST_PASSWORD
    }
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(credentials)
    token = loginRes.body.token
  })

  describe("success", () => {
    let newClass
    beforeEach(() => {
      newClass = {
        name: "Wim Hof Method",
        type: 4,
        start_time: "08:00:00",
        intensity: 1,
        location: "Wim's Icebath Studio"
      }
    })

    it("responds with status code 201", async () => {
      const expected = 201
      const newClass = {
        name: "Wim Hof Method",
        type: 4,
        start_time: "08:00:00",
        intensity: 1,
        location: "Wim's Icebath Studio"
      }

      const res = await request(server)
        .post("/api/classes")
        .send(newClass)
        .set('Authorization', token)
      const actual = res.status

      expect(actual).toBe(expected)
    })

    it("returns a success message and the new class", async () => {
      const expectedMessage = /class created successfully/i
      const expectedClass = {
        id: 6,
        name: "Wim Hof Method",
        instructor: "John Snow",
        type: "meditation",
        start_time: "08:00:00",
        intensity: "low",
        location: "Wim's Icebath Studio",
        max_class_size: 30,
        attendees: 0,
        duration: 60
      }

      const res = await request(server)
        .post("/api/classes")
        .send(newClass)
        .set("Authorization", token)
      const actualMessage = res.body.message
      const actualClass = res.body.newClass

      expect(actualMessage).toMatch(expectedMessage)
      expect(actualClass).toEqual(expectedClass)
    })

    it("adds the class to the instructor's class list", async () => {
      const expected = 2

      await request(server)
        .post("/api/classes")
        .send(newClass)
        .set("Authorization", token)
      const res = await request(server)
        .get("/api/users/2/classes")
      const actual = res.body

      expect(actual).toHaveLength(expected)
    })
  })

  describe("failure", () => {
    describe("auth errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          type: 4,
          start_time: "08:00:00",
          intensity: 1,
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 401 when not instructor", async () => {
        const expected = 401

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
        const actual = res.status

        expect(actual).toBe(expected)
      })
      it("returns 'access denied' when not authed", async () => {
        const expected = /access denied/i

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("name errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "",
          type: 4,
          start_time: "08:00:00",
          intensity: 1,
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'class name is required' when missing", async () => {
        const expected = /class name is required/i

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'invalid class name' when too long/short", async () => {
        const expected = /invalid class name/i
        newClass.name = "a"

        const shortRes = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualShortRes = shortRes.body.message

        expect(actualShortRes).toMatch(expected)

        const longRes = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualLongRes = longRes.body.message

        expect(actualLongRes).toMatch(expected)
      })

      it("returns 'class name taken' when reserved", async () => {
        const expected = /class name taken/i
        newClass.name = "Castle Black Combat"

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("category/type errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          start_time: "08:00:00",
          intensity: 1,
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'class type is required' when missing", async () => {
        const expected = /class type is required/i

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'invalid class type' when not int 1-5", async () => {
        const expected = /invalid class type/i
        newClass.type = "badwrong"

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("start time errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          type: 4,
          intensity: 1,
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'start time is required' when missing", async () => {
        const expected = /start time is required/i

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'invalid time' when misformatted", async () => {
        const expected = /invalid time/i
        newClass.start_time = "badwrong"

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("duration errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          type: 4,
          start_time: "08:00:00",
          intensity: 1,
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400
        newClass.duration = 9000000000

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'invalid duration' when too long/short/non-INT", async () => {
        const expected = /invalid duration/i

        newClass.duration = 9000000000
        const res1 = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualLong = res1.body.message
        expect(actualLong).toMatch(expected)

        newClass.duration = 1
        const res2 = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualShort = res2.body.message
        expect(actualShort).toMatch(expected)

        newClass.duration = "not a number"
        const res3 = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualBad = res3.body.message
        expect(actualBad).toMatch(expected)
      })
    })

    describe("intensity errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          type: 4,
          start_time: "08:00:00",
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'intensity is required' when missing", async () => {
        const expected = /intensity is required/i

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'invalid intensity' when not int 1-3", async () => {
        const expected = /invalid intensity/i

        newClass.intensity = "badwrong"
        const res1 = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualRes1 = res1.body.message
        expect(actualRes1).toMatch(expected)

        newClass.intensity = -500
        const res2 = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actualRes2 = res2.body.message
        expect(actualRes2).toMatch(expected)
      })
    })

    describe("location errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          type: 4,
          start_time: "08:00:00",
          intensity: 1,
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'location is required' when missing", async () => {
        const expected = /location is required/i

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'invalid location' when too long/short", async () => {
        const expected = /invalid location/i

        newClass.location = "a"
        let res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        expect(res.body.message).toMatch(expected)

        newClass.location = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        expect(res.body.message).toMatch(expected)
      })
    })

    describe("max class size errors", () => {
      let newClass
      beforeEach(() => {
        newClass = {
          name: "Wim Hof Method",
          type: 4,
          start_time: "08:00:00",
          intensity: 1,
          location: "Wim's Icebath Studio"
        }
      })

      it("responds with status code 400", async () => {
        const expected = 400
        newClass.max_class_size = 5000

        const res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'invalid class size' when too long/short/non-INT", async () => {
        const expected = /invalid class size/i

        newClass.max_class_size = "not a number"
        let res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        expect(res.body.message).toMatch(expected)

        newClass.max_class_size = 1
        res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        expect(res.body.message).toMatch(expected)

        newClass.max_class_size = 5000
        res = await request(server)
          .post("/api/classes")
          .send(newClass)
          .set("Authorization", token)
        expect(res.body.message).toMatch(expected)
      })
    })
  })
})

describe("[GET] /api/users/:id/classes", () => {
  describe("success", () => {
    it("responds with status code 200", async () => {
      const expected = 200

      const res = await request(server)
        .get("/api/users/1/classes")
      const actual = res.status

      expect(actual).toBe(expected)
    })

    it("returns an array of classes", async () => {
      const expected = [
        {
          duration: 120,
          id: 1,
          intensity: "high",
          location: "The Wall",
          name: "Castle Black Combat",
          start_time: "06:00:00"
        }
      ]

      const res = await request(server)
        .get("/api/users/2/classes")
      const actual = res.body

      expect(actual).toEqual(expected)
    })
  })

  describe("failure", () => {
    it("responds with status code 404", async () => {
      const expected = 404
      const res = await request(server)
        .get("/api/users/100/classes")
      const actual = res.status
      expect(actual).toBe(expected)
    })

    it("returns messaage 'user not found'", async () => {
      const expected = /user does not exist/i
      const res = await request(server)
        .get("/api/users/100/classes")
      const actual = res.body.message
      expect(actual).toMatch(expected)
    })
  })
})

describe("[GET] /api/classes/:id/join", () => {
  let token
  beforeAll(async () => {
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({
        username: "johnsnow",
        password: TEST_PASSWORD
      })
    token = loginRes.body.token
  })

  describe("success", () => {
    it("responds with status code 200", async () => {
      const expected = 200

      const res = await request(server)
        .get("/api/classes/2/join")
        .set("Authorization", token)
      const actual = res.status

      expect(actual).toBe(expected)
    })

    it("returns a success message", async () => {
      const expected = /successfully joined class/i

      const res = await request(server)
        .get("/api/classes/2/join")
        .set("Authorization", token)
      const actual = res.body.message

      expect(actual).toMatch(expected)
    })

    it("adds the user to the class's attendees", async () => {
      const expected = 2

      await request(server)
        .get("/api/classes/2/join")
        .set("Authorization", token)
      const res = await request(server)
        .get("/api/users/2/classes")
      const actual = res.body

      expect(actual).toHaveLength(expected)
    })
  })

  describe("failure", () => {
    describe("not logged in", () => {
      it("responds with status code 401", async () => {
        const expected = 401

        const res = await request(server)
          .get("/api/classes/2/join")
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'access denied' error", async () => {
        const expected = /access denied/i

        const res = await request(server)
          .get("/api/classes/2/join")
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("invalid class ID", () => {
      it("responds with status code 404", async () => {
        const expected = 404

        const res = await request(server)
          .get("/api/classes/500/join")
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'class not found' error", async () => {
        const expected = /class not found/i

        const res = await request(server)
          .get("/api/classes/500/join")
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("already attending", () => {
      it("responds with status code 400", async () => {
        const expected = 400

        const res = await request(server)
          .get("/api/classes/1/join")
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'already attending' error", async () => {
        const expected = /already attending/i

        const res = await request(server)
          .get("/api/classes/1/join")
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })
  })
})


describe("[DELETE] /api/classes/:id", () => {
  let token
  beforeAll(async () => {
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send({
        username: "johnsnow",
        password: TEST_PASSWORD
      })
    token = loginRes.body.token
  })

  describe("success", () => {
    it("responds with status code 200", async () => {
      const expected = 200

      const res = await request(server)
        .delete("/api/classes/1")
        .set("Authorization", token)
      const actual = res.status

      expect(actual).toBe(expected)
    })

    it("returns a success message", async () => {
      const expected = /successfully deleted class/i

      const res = await request(server)
        .delete("/api/classes/1")
        .set("Authorization", token)
      const actual = res.body.message

      expect(actual).toMatch(expected)
    })

    it("can delete a class from db", async () => {
      const expected = 4

      await request(server)
        .delete("/api/classes/1")
        .set("Authorization", token)
      const res = await request(server)
        .get("/api/classes")
      const actual = res.body

      expect(actual).toHaveLength(expected)
    })
  })


  describe("failure", () => {
    describe("unauthorized", () => {
      it("responds with status code 401", async () => {
        const expected = 401

        const res = await request(server)
          .delete("/api/classes/1")
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'access denied' error", async () => {
        const expected = /access denied/i

        const res = await request(server)
          .delete("/api/classes/1")
          .set("Authorization", "badwrong")
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("invalid class ID", () => {
      it("responds with status code 404", async () => {
        const expected = 404

        const res = await request(server)
          .delete("/api/classes/121")
          .set("Authorization", token)
        const actual = res.status

        expect(actual).toBe(expected)
      })

      it("returns 'class not found' error", async () => {
        const expected = /class not found/i

        const res = await request(server)
          .delete("/api/classes/121")
          .set("Authorization", token)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })
  })
})

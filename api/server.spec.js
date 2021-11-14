const request = require("supertest")

const server = require("./server")
const db = require("../data/db-config")
// const seededUsers = require("../data/seeds/001-users")

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
  describe("success", () => {
    let registration
    beforeEach(() => {
      registration = {
        username: "sheogorath",
        password: "TH3_M4D_PR1NC3",
        email: "sheogorath@shiveringisles.net",
        emailConfirm: "sheogorath@shiveringisles.net"
      }
    })

    it("responds with status code 201 upon valid registration", async () => {
      const expected = 201
      const res = await request(server)
        .post("/api/auth/register")
        .send(registration)
      const actual = res.status
      expect(actual).toBe(expected)
    })

    it("returns a success message and the newly created user", async () => {
      const expectedMessage = /new user registered, successfully/i
      const expectedUser = {
        username: registration.username,
        email: registration.email
      }

      const res = await request(server)
        .post("/api/auth/register")
        .send(registration)
      const actualMessage = res.body.message
      const actualUser = res.body.user

      expect(actualMessage).toMatch(expectedMessage)
      expect(actualUser).toMatchObject(expectedUser)
    })
  })

  describe("failure", () => {
    it("responds with status code 400 when registration info is invalid", async () => {
      const expected = 400
      const registration = { username: "" }

      const res = await request(server)
        .post("/api/auth/register")
        .send(registration)
      const actual = res.status

      expect(actual).toBe(expected)
    })

    describe("username error messages", () => {
      let registration
      beforeEach(() => {
        registration = {
          username: "",
          password: "TH3_M4D_PR1NC3",
          email: "sheogorath@shiveringisles.net",
          emailConfirm: "sheogorath@shiveringisles.net"
        }
      })

      it("returns 'username is required' when username is missing", async () => {
        const expected = /username is required/i

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'username must be 6 characters or longer' when username is too short", async () => {
        const expected = /username must be 6 characters or longer/i
        registration.username = "short"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'username must be shorter than 32 characters' when username is too long", async () => {
        const expected = /username must be shorter than 32 characters/i
        registration.username = "thisusernameiswaaaaaaaaaaaaaaaaaaaaaaaaytoolong"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'username taken' when username already in use", async () => {
        const expected = /username taken/i
        registration.username = "secretivechinchilla94"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
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
        const expected = /password is required/i

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'password must be 8 characters or longer' when password is too short", async () => {
        const expected = /password must be 8 characters or longer/i
        registration.password = "short"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'password must be shorter than 64 characters' when password is too long", async () => {
        const expected = /password must be shorter than 64 characters/i
        registration.password = "waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaytooooooooooooolong"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
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
        const expected = /email is required/i

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })

      it("returns 'email is invalid' when email is in invalid format", async () => {
        const expected = /email is invalid/i
        registration.email = "sheogorath"
        registration.emailConfirm = "sheogorath"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })

    describe("email confirmation error messages", () => {
      let registration
      beforeEach(() => {
        registration = {
          username: "sheogorath",
          password: "TH3_M4D_PR1NC3",
          email: "sheogorath@shiveringisles.net",
          emailConfirm: ""
        }
      })

      it("returns 'emails must match' when email/emailConfirm don't match", async () => {
        const expected = /emails must match/i
        registration.emailConfirm = "notmatching"

        const res = await request(server)
          .post("/api/auth/register")
          .send(registration)
        const actual = res.body.message

        expect(actual).toMatch(expected)
      })
    })
  })
})

describe("[POST] /api/auth/login", () => {
  describe("success", () => {
    let login
    beforeEach(() => {
      login = {
        username: "secretivechinchilla94",
        password: "secretivechinchilla94"
      }
    })

    it("responds with status code 200 upon successful login", async () => {
      const expected = 200

      const res = await request(server)
        .post("/api/auth/login")
        .send(login)
      const actual = res.status

      expect(actual).toBe(expected)
    })

    it("returns a welcome message and a login token", async () => {
      const expectedMessage = /welcome, secretivechinchilla94/i

      const res = await request(server)
        .post("/api/auth/login")
        .send(login)
      const actualMessage = res.body.message

      expect(actualMessage).toMatch(expectedMessage)
      expect(res.body).toHaveProperty("token")
    })
  })

  describe("failure", () => {
    it("responds with status code 400 when credentials are invalid", async () => {
      const expected = 400
      const login = { username: "willie-wonka", password: "badwrong" }

      const res = await request(server)
        .post("/api/auth/login")
        .send(login)
      const actual = res.status

      expect(actual).toBe(expected)
    })

    it("returns message 'username is required' when username is missing", async () => {
      const expected = /username is required/i
      const login = { password: "badwrong" }

      const res = await request(server)
        .post("/api/auth/login")
        .send(login)
      const actual = res.body.message

      expect(actual).toMatch(expected)
    })

    it("returns message 'password is required' when password is missing", async () => {
      const expected = /password is required/i
      const login = { username: "willie-wonka" }

      const res = await request(server)
        .post("/api/auth/login")
        .send(login)
      const actual = res.body.message

      expect(actual).toMatch(expected)
    })

    it("returns message 'invalid credentials' when credentials are bad", async () => {
      const expected = /invalid credentials/i
      const login = { username: "willie-wonka", password: "badwrong" }

      const res = await request(server)
        .post("/api/auth/login")
        .send(login)
      const actual = res.body.message

      expect(actual).toMatch(expected)
    })
  })
})

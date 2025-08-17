describe("API Tests", () => {
  const baseUrl = "https://jsonplaceholder.typicode.com";

  beforeEach(() => {
    // Visit a page to ensure browser context is available for fetch calls
    cy.visit("https://example.com");
  });

  it("should get posts from API", () => {
    cy.request("GET", `${baseUrl}/posts`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(100);
      expect(response.body[0]).to.have.property("id");
      expect(response.body[0]).to.have.property("title");
      expect(response.body[0]).to.have.property("body");
    });
  });

  it("should get a specific post by ID", () => {
    cy.request("GET", `${baseUrl}/posts/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body).to.have.property("title");
      expect(response.body).to.have.property("body");
      expect(response.body).to.have.property("userId");
    });
  });

  it("should create a new post", () => {
    const newPost = {
      title: "Test Post Title",
      body: "This is a test post body",
      userId: 1,
    };

    cy.request("POST", `${baseUrl}/posts`, newPost).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("id");
      expect(response.body.title).to.eq(newPost.title);
      expect(response.body.body).to.eq(newPost.body);
      expect(response.body.userId).to.eq(newPost.userId);
    });
  });

  it("should update an existing post", () => {
    const updatedPost = {
      id: 1,
      title: "Updated Post Title",
      body: "This is an updated post body",
      userId: 1,
    };

    cy.request("PUT", `${baseUrl}/posts/1`, updatedPost).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body.title).to.eq(updatedPost.title);
      expect(response.body.body).to.eq(updatedPost.body);
    });
  });

  it("should delete a post", () => {
    cy.request("DELETE", `${baseUrl}/posts/1`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should handle 404 error for non-existent post", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/posts/999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("should get posts by user ID", () => {
    cy.request("GET", `${baseUrl}/posts?userId=1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      response.body.forEach((post) => {
        expect(post.userId).to.eq(1);
      });
    });
  });

  describe("API Mocking with cy.intercept", () => {
    it("should mock API responses for testing different scenarios", () => {
      // Mock a successful GET request
      cy.intercept("GET", `${baseUrl}/posts/1`, {
        statusCode: 200,
        body: {
          id: 1,
          title: "Mocked Post Title",
          body: "This is a mocked post body for testing",
          userId: 1,
        },
      }).as("getMockedPost");

      // Mock a POST request with custom response
      cy.intercept("POST", `${baseUrl}/posts`, {
        statusCode: 201,
        body: {
          id: 999,
          title: "Mocked New Post",
          body: "This is a mocked new post",
          userId: 5,
        },
      }).as("createMockedPost");

      // Mock a PUT request with error response
      cy.intercept("PUT", `${baseUrl}/posts/1`, {
        statusCode: 400,
        body: {
          error: "Bad Request",
          message: "Invalid data provided",
        },
      }).as("updateMockedPost");

      // Mock a DELETE request with custom response
      cy.intercept("DELETE", `${baseUrl}/posts/1`, {
        statusCode: 204,
        body: null,
      }).as("deleteMockedPost");

      // Mock a GET request with network error
      cy.intercept("GET", `${baseUrl}/posts/999`, {
        forceNetworkError: true,
      }).as("networkErrorPost");

      // Now test the mocked endpoints using fetch through the browser
      // Test mocked GET response
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/1`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.title).to.eq("Mocked Post Title");
          expect(data.body).to.eq("This is a mocked post body for testing");
        });

      // Test mocked POST response
      const newPost = {
        title: "Test Post",
        body: "Test Body",
        userId: 5,
      };
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost),
          });
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.id).to.eq(999);
          expect(data.title).to.eq("Mocked New Post");
        });

      // Test mocked PUT error response
      const updatePost = {
        id: 1,
        title: "Updated Post",
        body: "Updated Body",
        userId: 1,
      };
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/1`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePost),
          });
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.error).to.eq("Bad Request");
          expect(data.message).to.eq("Invalid data provided");
        });

      // Test mocked DELETE response
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/1`, {
            method: "DELETE",
          });
        })
        .then((response) => {
          expect(response.status).to.eq(204);
        });

      // Test mocked network error
      cy.window().then((win) => {
        return win.fetch(`${baseUrl}/posts/999`).catch((error) => {
          expect(error.message).to.contain("Failed to fetch");
        });
      });

      // Verify all intercepts were called
      cy.wait("@getMockedPost");
      cy.wait("@createMockedPost");
      cy.wait("@updateMockedPost");
      cy.wait("@deleteMockedPost");
      cy.wait("@networkErrorPost");
    });

    it("should mock API responses with dynamic data", () => {
      // Mock with dynamic response based on request
      cy.intercept("GET", `${baseUrl}/posts/*`, (req) => {
        const postId = req.url.split("/").pop();
        req.reply({
          statusCode: 200,
          body: {
            id: parseInt(postId),
            title: `Dynamic Post ${postId}`,
            body: `This is dynamic post ${postId} content`,
            userId: Math.floor(Math.random() * 10) + 1,
          },
        });
      }).as("dynamicGetPost");

      // Test multiple dynamic responses
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/5`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.id).to.eq(5);
          expect(data.title).to.eq("Dynamic Post 5");
        });

      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/10`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.id).to.eq(10);
          expect(data.title).to.eq("Dynamic Post 10");
        });

      cy.wait("@dynamicGetPost");
    });

    it("should mock API responses with delays for performance testing", () => {
      // Mock with artificial delay
      cy.intercept("GET", `${baseUrl}/posts`, {
        statusCode: 200,
        body: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          title: `Post ${i + 1}`,
          body: `Body for post ${i + 1}`,
          userId: Math.floor(Math.random() * 10) + 1,
        })),
        delay: 1000, // 1 second delay
      }).as("delayedPosts");

      // Measure response time
      const startTime = Date.now();

      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          expect(data).to.have.length(50);
          expect(responseTime).to.be.greaterThan(1000); // Should take at least 1 second
        });

      cy.wait("@delayedPosts");
    });

    it("should mock API responses with different HTTP status codes", () => {
      // Mock various HTTP status codes
      cy.intercept("GET", `${baseUrl}/posts/unauthorized`, {
        statusCode: 401,
        body: { error: "Unauthorized", message: "Authentication required" },
      }).as("unauthorized");

      cy.intercept("GET", `${baseUrl}/posts/forbidden`, {
        statusCode: 403,
        body: { error: "Forbidden", message: "Access denied" },
      }).as("forbidden");

      cy.intercept("GET", `${baseUrl}/posts/server-error`, {
        statusCode: 500,
        body: {
          error: "Internal Server Error",
          message: "Something went wrong",
        },
      }).as("serverError");

      cy.intercept("GET", `${baseUrl}/posts/service-unavailable`, {
        statusCode: 503,
        body: {
          error: "Service Unavailable",
          message: "Service temporarily unavailable",
        },
      }).as("serviceUnavailable");

      // Test unauthorized response
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/unauthorized`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.error).to.eq("Unauthorized");
        });

      // Test forbidden response
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/forbidden`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.error).to.eq("Forbidden");
        });

      // Test server error response
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/server-error`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.error).to.eq("Internal Server Error");
        });

      // Test service unavailable response
      cy.window()
        .then((win) => {
          return win.fetch(`${baseUrl}/posts/service-unavailable`);
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          expect(data.error).to.eq("Service Unavailable");
        });

      // Wait for all intercepts
      cy.wait("@unauthorized");
      cy.wait("@forbidden");
      cy.wait("@serverError");
      cy.wait("@serviceUnavailable");
    });
  });
});

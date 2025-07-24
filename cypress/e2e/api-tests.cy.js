describe("API Tests", () => {
  const baseUrl = "https://jsonplaceholder.typicode.com";

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
});

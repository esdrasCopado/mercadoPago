export const config = {
    application: {
      cors: {
        server: [
          {
            origin: ["http://localhost:80", "https://botasjusaino.netlify.app"],
            credentials: true
          }
        ]
      }
    }
  };
  
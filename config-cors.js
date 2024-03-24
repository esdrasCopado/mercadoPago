export const config = {
    application: {
      cors: {
        server: [
          {
            origin: ["http://localhost:80", "https://proyectointegradoritson.netlify.app"],
            credentials: true
          }
        ]
      }
    }
  };
  
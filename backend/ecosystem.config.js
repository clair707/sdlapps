module.exports = {
  apps: [
    {
      name: "backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
        MONGO_URI: "mongodb+srv://ClairZ:Npt010203@cluster0.gctxmxr.mongodb.net/sdlapps?retryWrites=true&w=majority&appName=Cluster0"
      }
    }
  ]
};  
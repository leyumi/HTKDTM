const app = require("./src/app");

const PORT = process.env.DEV_APP_PORT || 3010;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

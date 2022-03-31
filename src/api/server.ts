import app from './app';

const { PORT = 3000, API_KEY } = process.env;

if (API_KEY) {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

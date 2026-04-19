import dotenv from 'dotenv';
import connectToDB from './src/config/database.js';
import app from './src/app.js';
dotenv.config();

await connectToDB();

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

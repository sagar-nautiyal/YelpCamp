const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// Define a function to establish the database connection
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-campDB');
        console.log("Database connected");

        // Call the seedDB function after the connection is established
        await seedDB();

        // Close the database connection after seeding is complete
        mongoose.connection.close();
    } catch (error) {
        console.error("Connection Error:", error);
    }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

// Define the seedDB function
async function seedDB() {
    try {
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const randomIndex = Math.floor(Math.random() * cities.length);
            const randomCity = cities[randomIndex];
            const generatedTitle = `${sample(descriptors)} ${sample(places)}`;
            const price = Math.floor(Math.random() * 20) + 10;

            // Check if a campground with the generated title already exists
            const existingCampground = await Campground.findOne({ title: generatedTitle });

            if (!existingCampground) {
                const camp = new Campground({
                    author: '64e4cb54e03e6f848bd23687',
                    location: `${randomCity.city}, ${randomCity.state}`,
                    title: generatedTitle,
                    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
                    price,
                    geometry: {
                        type: "Point",
                        coordinates: [
                            randomCity.longitude,
                            randomCity.latitude,
                        ]
                    },
                    images: [
                        {
                            url: 'https://res.cloudinary.com/dkzrefxml/image/upload/v1692815638/yelp_camp/c9x0d9wkmtaqsszehiof.png',
                            filename: 'yelp_camp/c9x0d9wkmtaqsszehiof'
                        },
                        {
                            url: 'https://res.cloudinary.com/dkzrefxml/image/upload/v1692815637/yelp_camp/gt1dft9u5ygwzvufq9qa.png',
                            filename: 'yelp_camp/gt1dft9u5ygwzvufq9qa'
                        },
                        {
                            url: 'https://res.cloudinary.com/dkzrefxml/image/upload/v1692815637/yelp_camp/hpu9lahpl5ogkv93uqql.png',
                            filename: 'yelp_camp/hpu9lahpl5ogkv93uqql'
                        }
                    ]
                });
                await camp.save();
            }
        }
        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Seeding Error:", error);
    }
}

// Call the connectToDatabase function to start the process
connectToDatabase();

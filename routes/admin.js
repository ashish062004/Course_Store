const {Router} = require('express');
const router = Router();
const {Admin, Course} = require('../db');
const AdminMiddleware = require('../middlewares/admin.js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/signup', async (req, res) => {
    const {username, password} = req.body;
    await Admin.create({
        username: username,
        password: password
        })
    res.json({
        message: 'Admin created successfully'
    });
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    console.log(JWT_SECRET);

    const user = await User.find({
        username,
        password
    })
    if (user) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect email and pass"
        })
    }
});


router.post('/addCourse', AdminMiddleware, async (req, res) => {
  const {title, description, price, imageLink} = req.body;
    const newCourse = await Course.create({
        title,
        description,
        price,
        imageLink
    });
  res.json({
    message: 'Course created successfully',
    courseId: newCourse._id
    })
});

router.get('/courses', AdminMiddleware, async (req, res) => {   
    // Implement fetching all courses logic
    const courses = await Course.find({});
    res.json(courses);
});

module.exports = router;
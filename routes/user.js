const {Router} = require('express');
const router = Router();
const UserMiddleware = require('../middlewares/user.js');
const {User, Course} = require('../db');

router.post('/signup', async (req, res) => {
    const {username, password} = req.body;
    await User.create({
        username: username,
        password: password
        })
    res.json({
        message: 'User created successfully'
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


router.post('/courses/:courseId', UserMiddleware, async (req, res) => {
    const {courseId} = req.params;
    const course = await Course.findById(courseId);
    if(!course) {
        return res.status(404).json({
            message: 'Course not found'  
        });
    }
    
    const user = await User.findById(req.user._id);
    user.purchasedCourses.push(course._id);
    await user.save();
    res.json({
        message: 'Course purchased successfully'
    });
});

router.post('/purchasedCourses', UserMiddleware, async (req, res) => {
    const user = req.user;
    const courses = await Course.find({
        _id: {
            $in: user.purchasedCourses
        }
    });
    res.json(courses);
});

router.post('/courses', async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({});
    res.json(courses);
});

module.exports = router;


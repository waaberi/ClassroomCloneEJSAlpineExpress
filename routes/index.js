const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

const data = [
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
];

router.get("/data", APIAuth, (req, res) => {
  return res.json(data);
});

router.get('/', ClientAuth, (req, res) => {
  return res.render('index');
});

module.exports = router;

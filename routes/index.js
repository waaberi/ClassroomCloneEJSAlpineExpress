const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

const data = [
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV7UTjHZ8eo7uJXtT6XizwjScriYrlrwB-Oh2UnyIVaYEU=s75-c",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV7UTjHZ8eo7uJXtT6XizwjScriYrlrwB-Oh2UnyIVaYEU=s75-c",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV7UTjHZ8eo7uJXtT6XizwjScriYrlrwB-Oh2UnyIVaYEU=s75-c",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV7UTjHZ8eo7uJXtT6XizwjScriYrlrwB-Oh2UnyIVaYEU=s75-c",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV7UTjHZ8eo7uJXtT6XizwjScriYrlrwB-Oh2UnyIVaYEU=s75-c",
    teacher: "Fake Teacher",
    description: "Test description",
    link: "/course/1"
  },
  {
    logo: "https://www.allegramarketingprint.com/assets/live/2/11/banners-flags.png",
    name: "Test Course",
    code: "TEST 101",
    teacher_avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV7UTjHZ8eo7uJXtT6XizwjScriYrlrwB-Oh2UnyIVaYEU=s75-c",
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

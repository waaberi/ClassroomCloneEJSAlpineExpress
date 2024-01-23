const express = require('express');
const router = express.Router();
const { APIAuth, ClientAuth } = require('../middleware/auth');

router.get('/', ClientAuth, (req, res) => {
  return res.render('index', {title: 'Express', courses: [
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
  ]});
});

module.exports = router;

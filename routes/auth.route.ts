import { Router } from "express";
import { body, validationResult, check } from "express-validator";

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = Router();

router.post(
  "/registration",
  body("name").isLength({ min: 6 }),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      const {name, email, password} = req.body;

      if(!errors.isEmpty()) {
        return res.status(400).json({message: "Что-то пошло не так"});
      }

      const candidate = await User.findOne({email});

      if(candidate) {
        return res.status(400).json({message: "Такой пользователь уже существует."});
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({name, email, password: hashedPassword});

      await user.save();

      res.status(201).json({message: "Пользователь создан"});

    } catch (err) {
      res.status(500).json({message: "Что-то пошло не так. Попробуйте снова."})
    }
  }
);

router.post(
  "/login",
  [
    check("name", "Короткое имя (мин. 6 симв.)"),
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Короткий пароль (мин. 8 симв.)")
  ],
  async(req, res) => {
    try {
      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({message: "Некорректные данные при входе."})
      }

      const {name, password} = req.body;

      const user = await User.findOne({name});

      if(!user) {
        return res.status(400).json({message: "Польователь не найден"});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch) {
        return res.status(400).json({message: "Неверный пароль"});
      }

      const token = jwt.sign(
        {userId: user.id},
        "1479314ade777",
        {expiresIn: "1h"}
      )

      res.json({token, userId: user.id});

    } catch(err) {
      res.status(500).json({message: "Что-то пошло не так, попробуйте снова"});
    }
  }
)

module.exports = router;
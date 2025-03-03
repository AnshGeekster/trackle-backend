import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const prisma = new PrismaClient();

// Schema Validation
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),
    state: z.string().min(2, "State must be at least 2 characters long"),
    role: z.enum(["USER", "ADMIN"]),
    city: z.string().min(2, "City must be at least 2 characters long"),
    district: z.string().min(2, "District must be at least 2 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });



const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// API Handler
export const register = async (req, res) => {
  try {
    // Validate request body
    const parsedData = registerSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ success: false, error: parsedData.error.errors });
    }

    const { name, email, password, phone,role, state, city, district } = parsedData.data;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role,
        state,
        city,
        district,
      },
    });

    res.status(201).json({ success: true, message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  } 



}




export const login = async (req, res) => {


  try {
       
      const parsedData = loginSchema.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({ success: false, error: parsedData.error.errors });
      }

      const { email, password } = parsedData.data;

      // Check if the user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return res.status(404).json({ success: false, error: "Invalid credentials" });
      }

      // Compare Password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
          if (!isPasswordValid) {
            return res.status(401).json({
              success: false,
              message: "Invalid credentials",
            });
          }



      return generateTokenAndSetCookie(existingUser, res);

  }

  catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }

}
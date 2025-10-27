import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, CreateUserData, LoginCredentials } from "@/lib/entity/User";
import { BaseService } from "./initDB";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";

export class AuthService extends BaseService<User> {
  constructor() {
    super(User); // Pass entity to BaseService
  }

  // Create a new user
  async createUser(userData: CreateUserData): Promise<User> {
    const existingUser = await this.findOne({ email: userData.email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    return this.create({ ...userData, password: hashedPassword });
  }

  // Validate password
  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT
  generateToken(user: User): string {
    return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  // Verify JWT
  verifyToken(token: string): unknown {
    return jwt.verify(token, JWT_SECRET);
  }

  // Login
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string } | null> {
    const user = await this.findOne({ email: credentials.email });
    if (!user) return null;

    const isValid = await this.validatePassword(
      credentials.password,
      user.password
    );
    if (!isValid) return null;

    const token = this.generateToken(user);
    return { user, token };
  }

  // Get or create admin user
  async getOrCreateAdminUser(): Promise<User> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables"
      );
    }

    let user = await this.findOne({ email: adminEmail });
    if (!user) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      user = await this.create({
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
      });
    }

    return user;
  }
}

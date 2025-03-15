import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use

    const user = await this.userService.find(email);

    if (user.length) {
      throw new BadRequestException('Email in use');
    }

    // If email is not in use, hash the password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the password using the salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`;

    // Create a new user and save it
    const newUser = await this.userService.create(email, result);

    // Return the user
    return newUser;
  }

  async signin(email: string, password: string) {
    // Implement sign in
    const [user] = await this.userService.find(email);

    // If user is not found, throw an error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Split the hashed password and the salt
    const [salt, storedHash] = user.password.split('.');

    // Hash the password that the user provided
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Compare the hashed password with the stored hash
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Invalid credentials');
    }

    // Return the user
    return user;
  }
}

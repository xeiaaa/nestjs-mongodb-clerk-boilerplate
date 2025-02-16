import { Body, Controller, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClerkWebhookEvent } from 'src/common/types/webhook.types';
import { User, UserDocument } from 'src/schemas/user.schema';

@Controller('webhook')
export class WebhookController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post('clerk')
  async handleClerkWebhook(@Body() body: ClerkWebhookEvent): Promise<string> {
    console.log('Webhook Event:', body);

    if (body.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = body.data;

      // Extract primary email
      const email = email_addresses.length
        ? email_addresses[0].email_address
        : null;

      const existingUser = await this.userModel.findOne({ clerkId: id }).exec();
      if (existingUser) {
        console.log(`User with Clerk ID ${id} already exists.`);
        return 'User already exists';
      }

      const newUser = new this.userModel({
        clerkId: id,
        email,
        firstName: first_name,
        lastName: last_name,
      });

      await newUser.save();
      console.log('New user saved:', newUser);
    } else if (body.type === 'user.updated') {
      const { id, first_name, last_name } = body.data;

      const existingUser = await this.userModel.findOne({ clerkId: id }).exec();
      if (!existingUser) {
        console.log(`User with Clerk ID ${id} does not exist.`);
        return `User with Clerk ID ${id} does not exist.`;
      }

      existingUser.firstName = first_name;
      existingUser.lastName = last_name;

      await existingUser.save();
      console.log('Existing user updated:', existingUser);
    } else if (body.type === 'user.deleted') {
      const { id } = body.data;

      const existingUser = await this.userModel.findOne({ clerkId: id }).exec();
      if (!existingUser) {
        console.log(`User with Clerk ID ${id} does not exist.`);
        return `User with Clerk ID ${id} does not exist.`;
      }

      existingUser.isArchived = true;

      await existingUser.save();
      console.log('User archived:', existingUser);
    }

    return 'Webhook received';
  }
}

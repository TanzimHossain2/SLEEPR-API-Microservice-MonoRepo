import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      console.log('Error in JwtAuthGuard:', err);
      if (!info) {
        console.log('No info provided');
      }
      throw err || new Error('User not authenticated');
    }
    return user;
  }
}

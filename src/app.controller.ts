import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return {
      encryptAPI: 'http://localhost:3000/eth/encrypt',
    };
  }
}

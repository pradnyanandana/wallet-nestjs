import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { script: 'http://localhost:3000/encrypt.js' };
  }
}

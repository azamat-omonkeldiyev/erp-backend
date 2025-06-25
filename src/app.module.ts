import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterController } from './multer/multer.controller';
import { CategoryModule } from './category/category.module';
import { StackModule } from './stack/stack.module';
import { RegionModule } from './region/region.module';
import { StatusModule } from './status/status.module';
import { WorkListModule } from './work-list/work-list.module';
import { RoomModule } from './room/room.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [ PrismaModule,
    UserModule, ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }), CategoryModule, StackModule, RegionModule, StatusModule, WorkListModule, RoomModule, StudentsModule, TeachersModule, GroupsModule],
  controllers: [AppController,MulterController],
  providers: [AppService],
})
export class AppModule {}

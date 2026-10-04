import { Module, OnModuleInit } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FoldersController } from './folders.controller';
import { FoldersService } from './folders.service';
import { File } from './models/file.model';
import { Folder } from './models/folder.model';
import { User } from '../users/models/user.model';
import { AccessControlModule } from '@/common/access-control/access-control.module';

@Module({
  imports: [SequelizeModule.forFeature([File, Folder, User]), AccessControlModule],
  controllers: [FilesController, FoldersController],
  providers: [FilesService, FoldersService],
  exports: [FilesService, FoldersService],
})
export class FilesModule implements OnModuleInit {
  constructor(private readonly filesService: FilesService) {}

  async onModuleInit() {
    await this.filesService.ensureStorageRoot();
  }
}

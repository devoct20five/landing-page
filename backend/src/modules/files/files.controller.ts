import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { randomUUID } from 'crypto';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { QueryFileDto } from './dto/query-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RequirePermissions } from '@/common/decorators/permissions.decorator';
import type { RequestUser } from '../auth/types/authenticated-user.type';
const storageRoot = resolve(process.env.FILE_STORAGE_ROOT ?? './storage');

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @RequirePermissions('files.view')
  findAll(@Query() query: QueryFileDto, @CurrentUser() user: RequestUser) {
    return this.filesService.findAll(query, user);
  }

  @Get(':id')
  @RequirePermissions('files.view')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.filesService.findOne(id, user);
  }

  @Post()
  @RequirePermissions('files.upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: storageRoot,
        filename: (_req, file, cb) =>
          cb(null, `${randomUUID()}${extname(file.originalname)}`),
      }),
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB, tune per deployment
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.filesService.create(file, body, user);
  }

  @Patch(':id')
  @RequirePermissions('files.edit')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFileDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.filesService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions('files.delete')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: RequestUser) {
    return this.filesService.remove(id, user);
  }

  // docs/00_CURRENT_STATE_AUDIT.md §38/§39: this used to stream any file
  // back to any authenticated user who knew or could guess its UUID — no
  // ownership check at all. findOne(id, user) now resolves the file's
  // project (directly or via its folder) and asserts the requester
  // actually has access to that project before the file ever touches the
  // response stream.
  @Get(':id/download')
  @RequirePermissions('files.view')
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ) {
    const file = await this.filesService.findOne(id, user);
    return res.download(
      this.filesService.resolveStoragePath(file.storageUrl),
      file.name,
    );
  }
}

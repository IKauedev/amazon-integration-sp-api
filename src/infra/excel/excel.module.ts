import { Module } from '@nestjs/common';
import { ExcelReadService } from './service/read/excel-read.service';
import { ExcelWriteService } from './service/write/excel-write.service';

@Module({
  imports: [],
  providers: [
    ExcelReadService,
    ExcelWriteService
  ],
  exports: [
    ExcelReadService,
    ExcelWriteService
  ],
})
export class ExcelModule {}

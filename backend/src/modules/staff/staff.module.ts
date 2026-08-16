import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffProfile } from './models/staff-profile.model';
import { Attendance } from './models/attendance.model';
import { Payroll } from './models/payroll.model';
import { User } from '../users/models/user.model';
import { StaffService } from './staff.service';
import { AttendanceService } from './attendance.service';
import { PayrollService } from './payroll.service';
import { StaffController } from './staff.controller';
import { AttendanceController } from './attendance.controller';
import { PayrollController } from './payroll.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([StaffProfile, Attendance, Payroll, User]),
  ],
  controllers: [StaffController, AttendanceController, PayrollController],
  providers: [StaffService, AttendanceService, PayrollService],
  exports: [StaffService, AttendanceService, PayrollService, SequelizeModule],
})
export class StaffModule {}

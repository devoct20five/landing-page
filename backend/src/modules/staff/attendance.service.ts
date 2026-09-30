import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  Attendance,
  AttendanceStatus,
  WorkMode,
} from './models/attendance.model';
import { User } from '../users/models/user.model';
import {
  CheckInDto,
  QueryAttendanceDto,
  UpsertAttendanceDto,
} from './dto/attendance.dto';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowTimeStr(): string {
  return new Date().toISOString().slice(11, 19);
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
  ) {}

  /** Staff self check-in (2.7). Creates today's row if it doesn't exist. */
  async checkIn(staffId: string, dto: CheckInDto): Promise<Attendance> {
    const workDate = todayStr();
    const [row, created] = await this.attendanceModel.findOrCreate({
      where: { staffId, workDate },
      defaults: {
        staffId,
        workDate,
        checkIn: nowTimeStr(),
        workMode: dto.workMode ?? WorkMode.OFFICE,
        status: AttendanceStatus.PRESENT,
      } as any,
    });

    if (!created) {
      if (row.checkIn) {
        throw new BadRequestException('Already checked in today');
      }
      await row.update({
        checkIn: nowTimeStr(),
        workMode: dto.workMode ?? row.workMode,
        status: AttendanceStatus.PRESENT,
      });
    }

    return row;
  }

  /** Staff self check-out (2.7). Computes hours_worked from check_in. */
  async checkOut(staffId: string): Promise<Attendance> {
    const workDate = todayStr();
    const row = await this.attendanceModel.findOne({
      where: { staffId, workDate },
    });
    if (!row || !row.checkIn) {
      throw new BadRequestException('No check-in found for today');
    }
    if (row.checkOut) {
      throw new BadRequestException('Already checked out today');
    }

    const checkOut = nowTimeStr();
    const hoursWorked = this.diffHours(row.checkIn, checkOut);

    await row.update({ checkOut, hoursWorked });
    return row;
  }

  /** Admin manual override for a given staff/date (3.7). */
  async upsert(staffId: string, dto: UpsertAttendanceDto): Promise<Attendance> {
    const [row] = await this.attendanceModel.findOrCreate({
      where: { staffId, workDate: dto.workDate },
      defaults: { staffId, ...dto } as any,
    });
    await row.update(dto);
    return row;
  }

  /** Company-wide attendance dashboard with date navigation (3.7). */
  async findByDate(query: QueryAttendanceDto) {
    const workDate = query.date ?? todayStr();
    const userWhere: any = {};
    if (query.search) {
      userWhere[Op.or] = [
        { firstName: { [Op.like]: `%${query.search}%` } },
        { lastName: { [Op.like]: `%${query.search}%` } },
      ];
    }

    return this.attendanceModel.findAll({
      where: { workDate },
      include: [{ model: User, where: userWhere }],
      order: [['staffId', 'ASC']],
    });
  }

  /** Personal attendance history + hours-worked summary for one staff member. */
  async findForStaff(staffId: string, from?: string, to?: string) {
    const where: any = { staffId };
    if (from || to) {
      where.workDate = {};
      if (from) where.workDate[Op.gte] = from;
      if (to) where.workDate[Op.lte] = to;
    }

    const rows = await this.attendanceModel.findAll({
      where,
      order: [['workDate', 'DESC']],
    });

    const totalHours = rows.reduce(
      (sum, r) => sum + (Number(r.hoursWorked) || 0),
      0,
    );

    return { entries: rows, totalHours: Math.round(totalHours * 100) / 100 };
  }

  private diffHours(checkIn: string, checkOut: string): number {
    const [inH, inM, inS] = checkIn.split(':').map(Number);
    const [outH, outM, outS] = checkOut.split(':').map(Number);
    const inSeconds = inH * 3600 + inM * 60 + (inS ?? 0);
    const outSeconds = outH * 3600 + outM * 60 + (outS ?? 0);
    const diff = Math.max(0, outSeconds - inSeconds) / 3600;
    return Math.round(diff * 100) / 100;
  }
}

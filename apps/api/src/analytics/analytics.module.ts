import { Module } from "@nestjs/common";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { EventsRepository } from "../repositories/event.repository";
import { BookingsRepository } from "../repositories/booking.repository";


@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, EventsRepository, BookingsRepository],
})
export class AnalyticsModule {}

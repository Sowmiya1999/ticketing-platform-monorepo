import { Controller, Get, Param } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("events/:id")
  async getEventAnalytics(@Param("id") eventId: string) {
    return this.analyticsService.getEventAnalytics(+eventId);
  }

  @Get("summary")
  async getSummaryAnalytics() {
    return this.analyticsService.getSummaryAnalytics();
  }
}

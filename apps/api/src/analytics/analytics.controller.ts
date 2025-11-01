import { Controller, Get, Logger, Param } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly logger:Logger
  ) {}

    @Get("/summary")
  async getSummaryAnalytics() {
    this.logger.log("Entered AnalyticsController.getSummaryAnalytics called");
    return await this.analyticsService.getSummaryAnalytics();
  }

  @Get(":id")
  async getEventAnalytics(@Param("id") eventId: number) {
    this.logger.log("Entered AnalyticsController.getEventAnalytics called");
    return await this.analyticsService.getEventAnalytics(eventId);
  }


}

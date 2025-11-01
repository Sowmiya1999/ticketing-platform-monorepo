import { Global, Logger, Module } from "@nestjs/common";
import { EventsModule } from "./events/events.module";
import { BookingsModule } from "./bookings/bookings.module";
import { PricingEngineModule } from "./pricingEngine/pricingEngine.module";
import { PricingSchedulerModule } from "./pricingScheduler/pricingScheduler.module";
import { PricingEngineService } from "./pricingEngine/pricingEngine.service";
import { ScheduleModule } from "@nestjs/schedule";
import { AnalyticsModule } from "./analytics/analytics.module";



@Module({
    
    imports: [
        EventsModule,
        BookingsModule,
        PricingEngineModule,
        PricingSchedulerModule,
        AnalyticsModule,
        ScheduleModule.forRoot()
    ],
    providers:[
        Logger
    ]
})

export class AppModule {}
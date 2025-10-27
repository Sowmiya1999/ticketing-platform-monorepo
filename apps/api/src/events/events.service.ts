import { Injectable } from "@nestjs/common";
import { Event } from "../database/schema";
import { EventsRepository } from "../repositories/event.repository";
import { EventDTO } from "./dto/createEvent.dto";

@Injectable()
export class EventsService {
  constructor(private readonly eventRepository: EventsRepository) {}

  // method to get all the event info from db that is not in deleted status
 async getAllEventsData(): Promise<Event[]> {
    try {
      console.log(`EventsService.getAllEventsData is called `);
      return this.eventRepository.findAllEvent();
    } catch (error) {
      console.error(`EventsService.getAllEventsData produced error: ${error}`);
      return [];
    }
  }

  // method to get a single event's info based on provided eventId
  async getEventById(eventId: number): Promise<Event> {
    try {
      console.log(
        `EventsService.getEventsById is called for eventId: ${eventId}`
      );
      const [event] = await this.eventRepository.findEventByIds([eventId]);
      return event || {} as Event;
    } catch (error) {
      console.error(`EventsService.getEventsById produced error: ${error}`);
      return {} as Event;
    }
  }

  // method to create new event with provided input data
  async createNewEvent(eventData:EventDTO):Promise<Event>{
    try{
       console.log(
        `EventsService.createNewEvent is called for eventData: ${JSON.stringify(eventData)}`
      );
      return await this.eventRepository.createEvent(eventData);
    }
    catch(error){
      console.error(`EventsService.createNewEvent produced error: ${error}`);
      return {} as Event;
    }
  }
}

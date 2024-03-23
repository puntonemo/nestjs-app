import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { MongoDBService } from './mongodb.service';

@Module({
    imports: [ConfigModule],
    providers: [SupabaseService, MongoDBService],
    exports: [SupabaseService, MongoDBService]
})
export class DatabaseModule {}

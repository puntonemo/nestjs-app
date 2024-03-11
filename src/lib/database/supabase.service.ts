import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly logger = new Logger(SupabaseService.name);
    private clientInstance: SupabaseClient;

    constructor(private readonly configService: ConfigService) {}

    getClient() {
        if (this.clientInstance) {
            return this.clientInstance;
        }

        const SUPABASE_URL = this.configService.get('SUPABASE_URL');
        const SUPABASE_KEY = this.configService.get('SUPABASE_KEY');
        this.logger.log(`DatabaseModule client initialized : ${SUPABASE_URL}`);

        this.clientInstance = createClient(SUPABASE_URL, SUPABASE_KEY);

        return this.clientInstance;
    }
}

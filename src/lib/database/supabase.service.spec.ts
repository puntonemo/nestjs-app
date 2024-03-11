import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
    let service: SupabaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: [
                        '.env.test.local',
                        '.env.development.local',
                        '.env'
                    ]
                })
            ],
            providers: [SupabaseService]
        }).compile();

        service = module.get<SupabaseService>(SupabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be export getClient method', () => {
        expect(service.getClient).toBeDefined();
    });

    it('should be able to create supabase client', () => {
        expect(service.getClient()).toBeInstanceOf(SupabaseClient);
    });
});

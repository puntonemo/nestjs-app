import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion, Db } from 'mongodb';

@Injectable()
export class MongoDBService {
    private readonly logger = new Logger(MongoDBService.name);
    private clientInstance: MongoClient;
    private defaultDatabase: Db;
    constructor(private readonly configService: ConfigService) {}

    async getClient() {
        if (this.clientInstance) {
            return this.clientInstance;
        }
        const MONGODB_URL = this.configService.get('MONGODB_URL');
        const uri = MONGODB_URL;
        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        this.clientInstance = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        try {
            // Connect the client to the server	(optional starting in v4.7)
            await this.clientInstance.connect();
            this.logger.log(
                `DatabaseModule client initialized : ${MONGODB_URL}`
            );
            return this.clientInstance;
        } catch (error) {
            // Ensures that the client will close when you finish/error
            this.logger.log(`DatabaseModule client failed`, [{ error }]);
            await this.clientInstance.close();
            this.clientInstance = undefined;
            console.log(error);
            throw `${MongoDBService.name} getClient() failed`;
        }
    }
    async getDefaultDatabase() {
        if (this.defaultDatabase) return this.defaultDatabase;
        if (!this.clientInstance) {
            this.clientInstance = await this.getClient();
        }
        this.defaultDatabase = (await this.getClient()).db(
            this.configService.get('MONGODB_DEFAULT_DATABASE')
        );
        return this.defaultDatabase;
    }
}

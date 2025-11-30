/**
 * Base Model class for database operations
 * Provides common functionality for all models
 */
abstract class Model {
    protected database: any;

    constructor(database: any) {
        this.database = database;
    }

    /**
     * Close database connection
     */
    close(): void {
        if (this.database && typeof this.database.close === 'function') {
            this.database.close();
        }
    }

    /**
     * Execute database operation with error handling
     */
    protected async executeQuery<T>(
        operation: () => Promise<T>,
        operationName: string
    ): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            console.error(`Error in ${operationName}:`, error);
            throw error;
        }
    }
}

export default Model;
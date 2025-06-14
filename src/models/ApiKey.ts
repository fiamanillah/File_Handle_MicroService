// src/models/ApiKey.ts
import { Schema, model } from 'mongoose';

interface IApiKey {
  serviceName: string; // Example: "upload-service"
  key: string; // The API key (e.g., "sk_abc123...")
  permissions: string[]; // Example: ["files:read", "files:write"]
  isActive: boolean; // Can be deactivated
}

const ApiKeySchema = new Schema<IApiKey>({
  serviceName: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true },
  isActive: { type: Boolean, default: true },
});

export const ApiKeyModel = model<IApiKey>('ApiKey', ApiKeySchema);

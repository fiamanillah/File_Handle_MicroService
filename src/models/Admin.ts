import bcrypt from 'bcrypt';
import { Schema, model, Document } from 'mongoose';

interface IAdmin extends Document {
  username: string;
  password: string;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const AdminModel = model<IAdmin>('Admin', AdminSchema);

// Initialize default admin if not exists
export async function initializeDefaultAdmin() {
  const defaultAdmin = {
    username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'securepassword123',
  };

  const existingAdmin = await AdminModel.findOne({
    username: defaultAdmin.username,
  });
  if (!existingAdmin) {
    await AdminModel.create(defaultAdmin);
    console.log('Default admin account created');
  }
}

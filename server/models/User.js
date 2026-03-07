import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: [/^[a-zA-Z0-9_@]+$/, "Username can only contain letters, numbers, and underscores"],
        index: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        immutable: true,
        match: [/.+\@.+\..+/, "Invalid email format"],
        index: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    role: {
        type: String,
        required: true,
        enum: ['reader', 'author', 'admin'],
        default: 'reader',
        index: true
    },

    profilePicture: {
        type: String,
        default: '',
        // validate: {
        //   validator: function(v) {
        //     return v === '' || v.startsWith('http');
        //   },
        //   message: "Profile picture must be a valid URL"
        // }
    },

    bio: {
        type: String,
        maxlength: 250,
        trim: true,
        default: ''
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    aiSettings: {
        preferredTone: {
            type: String,
            enum: ['professional', 'casual', 'humorous', 'academic', 'persuasive'],
            default: 'professional'
        },
        targetAudience: {
            type: String,
            trim: true,
            default: 'general'
        }
    },

    aiUsage: {
        tokensUsedThisMonth: {
            type: Number,
            default: 0,
            min: 0
        },

        monthlyTokenLimit: {
            type: Number,
            default: 10000,
            min: 0
        },

        subscriptionTier: {
            type: String,
            enum: ['free', 'pro', 'enterprise'],
            default: 'free',
            index: true
        },

        lastResetDate: {
            type: Date,
            default: Date.now
        }
    },

    savedPrompts: [{
        type: String,
        maxlength: 500,
        trim: true
    }],

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    bookmarkedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]

}, {
    timestamps: true,
    versionKey: false
});


userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return ;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    ;
});

const User = mongoose.model('User', userSchema);
export default User;
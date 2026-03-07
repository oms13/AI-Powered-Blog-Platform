import mongoose from 'mongoose';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        slug: {
            type: String,
            unique: true,
            index: true
        },

        content: [
            {
                id: {
                    type: String,
                    required: true
                },
                type: {
                    type: String,
                    enum: ["paragraph", "image", "heading", "quote", "code"],
                    required: true
                },
                content: {
                    type: String,
                    required: true
                }
            }
        ],

        summary: {
            type: String
        },

        coverImage: {
            type: String
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        tags: [{
            type: String
        }],

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },

        likes: {
            type: Number,
            default: 0
        },

        userLiked: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        views: {
            type: Number,
            default: 0
        },

        readTime: {
            type: Number
        },

        commentsCount: {
            type: Number,
            default: 0
        },

        isFeatured: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    });

blogSchema.pre("save", function () {

    if (!this.isModified("title")) {
        return;
    }

    const slug = slugify(this.title, { lower: true, strict: true });

    this.slug = `${slug}-${nanoid(6)}`;

});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
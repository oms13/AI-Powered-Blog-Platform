import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { aiContent } from "../utils/aiService.js";
import verifyToken from "../utils/verifyToken.js";

export const aiGenerator = async (req, res) => {
    try {
        const { promptText, type } = req.body;
        const aiResult = await aiContent(promptText, type);
        if (aiResult) {
            res.json({
                aiText: aiResult,
                success: true
            })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
}

export const publish = async (req, res) => {
    try {
        const user = verifyToken(req);

        const { title, coverImage, tags, content, status } = req.body;
        const blog = await Blog.create({
            title,
            content,
            coverImage,
            tags,
            author: user.id,
            status
        });

        return res.json({
            success: true,
            blogSlug: blog.slug
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: ' + error.message
        });
    }
};

export const blogInfo = async (req, res) => {
    try {
        const user = verifyToken(req);
        const { slug } = req.body;

        const blog = await Blog.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } },
            { new: true }
        ).populate("author", "name username profilePicture");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }


        res.json({
            success: true,
            blogContent: {
                _id: blog._id,
                title: blog.title,
                author: {
                    name: blog.author.name,
                    username: blog.author.username,
                    avatar: blog.author.profilePicture
                },
                createdAt: blog.createdAt,
                content: blog.content.map(({ type, content }) => ({
                    type,
                    text: content
                })),
                likes: blog.likes,
                views: blog.views,
                comments: blog.comments,
                userHasLiked: blog.userLiked.some(id => id.equals(user.id))
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error: " + error.message
        });

    }
};

export const toggleLike = async (req, res) => {
    try {
        let user = verifyToken(req);
        user = user.id;
        const { slug } = req.body;

        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        const checkLiked = blog.userLiked.some(id => id.equals(user));

        if (checkLiked) {
            await Blog.updateOne(
                { slug: slug },
                {
                    $pull: { userLiked: user },
                    $inc: { likes: -1 }
                },
                { returnDocument: 'after' }
            );
            return res.json({ success: true, message: "Post unliked" });

        } else {
            await Blog.updateOne(
                { slug: slug },
                {
                    $addToSet: { userLiked: user },
                    $inc: { likes: 1 },
                },
                { returnDocument: 'after' }
            );
            return res.json({ success: true, message: "Post liked" });
        }


    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const userProfile = async (req, res) => {
    try {
        const { username, currentUserID, role } = req.body;
        const userInfo = await User.findOne({ username });

        if (!userInfo) {
            return res.json({
                message: `User ${username} not found`
            });
        }
        console.log(userInfo.role, role);
        if (currentUserID === userInfo._id && userInfo.role !== role) {
            return res.json({
                message: `${username} not found for ${role}`
            });
        }
        const blogs = await Blog.find({ author: userInfo._id });

        res.json({
            success: true,
            user: {
                name: userInfo.name,
                bio: userInfo.bio,
                profilePicture: userInfo.profilePicture,
                coverPicture: userInfo.coverPicture,
                followers: userInfo.followers,
                following: userInfo.following,
                isFollowed: userInfo.followers.some(id => id.equals(currentUserID))
            },
            blogs: blogs
        })

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" + error.message });
    }
}

export const toggleFollow = async (req, res) => {
    try {
        const { profileUser, currentUserID } = req.body;
        const user = await User.findOne({ username: profileUser });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const checkFollowing = user.followers.some(id => id.equals(currentUserID));

        if (checkFollowing) {
            await User.updateOne(
                { username: profileUser },
                {
                    $pull: { followers: currentUserID },
                },
            )
            await User.updateOne(
                { _id: currentUserID },
                {
                    $pull: { following: user._id },
                },
            )

        } else {
            await User.updateOne(
                { username: profileUser },
                {
                    $addToSet: { followers: currentUserID },
                },

            )
            await User.updateOne(
                { _id: currentUserID },
                {
                    $addToSet: { following: user._id },
                },

            )
        }
        res.json({ success: true })

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const comment = async (req, res) => {
    try {
        const { userID, blogId, content } = req.body;

        if (!blogId || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Blog ID and comment content are required."
            });
        }

        if (!userID) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User ID is missing."
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found."
            });
        }

        const newComment = {
            user_id: userID,
            content: content.trim(),
            likes: [],
        };

        blog.comments.push(newComment);
        await blog.save();

        await blog.populate({
            path: 'comments.user_id',
            select: 'name username profilePicture'
        });

        const addedComment = blog.comments[blog.comments.length - 1];

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            comment: addedComment
        });

    } catch (error) {
        console.error("Error in comment controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while adding the comment."
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;

        const blog = await Blog.findById(blogId).populate(
            'comments.user_id',
            'name username profilePicture role'
        );

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        return res.status(200).json({
            success: true,
            comments: blog.comments
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { userID } = req.body;

        if (!userID) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found." });
        }

        const comment = blog.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        if (comment.user_id.toString() !== userID.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment." });
        }

        blog.comments.pull(commentId);

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully."
        });

    } catch (error) {
        console.error("Error in deleteComment:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting the comment."
        });
    }
};


export const toggleCommentLike = async (req, res) => {
    try {
        const { blogId, commentId, userID } = req.body;

        if (!blogId || !commentId || !userID) {
            return res.status(400).json({ success: false, message: "Blog ID, Comment ID, and User ID are required." });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found." });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        const hasLiked = comment.likes.includes(userID);

        if (hasLiked) {
            comment.likes = comment.likes.filter(id => id.toString() !== userID.toString());
        } else {
            comment.likes.push(userID);
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            message: hasLiked ? "Comment unliked" : "Comment liked",
            likes: comment.likes
        });

    } catch (error) {
        console.error("Error toggling comment like:", error);
        return res.status(500).json({ success: false, message: "Server error while toggling comment like." });
    }
};


export const getFeed = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name username profilePicture')
            .exec();

        res.json({
            success: true,
            blogs: blogs
        });
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ success: false, message: "Server error while fetching feed" });
    }
};


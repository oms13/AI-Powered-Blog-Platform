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
        ).populate("author", "name profilePicture");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }


        res.json({
            success: true,
            blogContent: {
                title: blog.title,
                author: {
                    name: blog.author.name,
                    avatar: blog.author.profilePicture
                },
                createdAt: blog.createdAt,
                content: blog.content.map(({ type, content }) => ({
                    type,
                    text: content
                })),
                likes: blog.likes,
                views: blog.views,
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
        //const userDecode = verifyToken(req); //will be used when we need to verify wheather the cuurent user and the profile opened is same or not so that, we can include the option of edit profile,etc
        const { username, role } = req.body;
        const userInfo = await User.findOne({ username });

        if (!userInfo) {
            return res.json({
                message: `User ${username} not found`
            });
        }
        if (userInfo.role !== role) {
            return res.json({
                message: `${username} not found for ${role}`
            });
        }
        const blogs = await Blog.find({ author: userInfo._id });
        console.log(blogs);

        res.json({
            success: true,
            user: {
                name: userInfo.name,
                bio: userInfo.bio,
                profilePicture: userInfo.profilePicture,
            },
            blogs: blogs
        })

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" + error.message });
    }
}

export const getFeed = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name profilePicture')
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


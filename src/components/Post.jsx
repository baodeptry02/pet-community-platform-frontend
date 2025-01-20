/* eslint-disable react/prop-types */
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { LuBookmark } from "react-icons/lu";
import { FaBookmark } from "react-icons/fa";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import VerifiedBadge from "./VerifiedBadge";
import {
  bookmarkAPI,
  commentAPI,
  deletePostAPI,
  likeOrDislikeAPI,
} from "@/apis/post";
import { setAuthUser } from "@/redux/authSlice";
import Carousel from "./ui/carousel";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [bookmarked, setBookmarked] = useState(
    user.bookmarks?.includes(post?._id) || false
  );
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await likeOrDislikeAPI(post._id, action);
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await commentAPI(post._id, text);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await deletePostAPI(post._id);
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await bookmarkAPI(post._id);
      if (res.data.success) {
        setBookmarked(!bookmarked);
        const updatedUser = {
          ...user,
          bookmarks: bookmarked
            ? user.bookmarks.filter((id) => id !== post._id)
            : [...user.bookmarks, post._id],
        };
        dispatch(setAuthUser(updatedUser));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-8 w-full max-w-[450px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar style={{ border: "1px solid #e0e0e0" }}>
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${post.author?._id}`}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {post.author?.username}
              </span>
              {post.author.isVerified && <VerifiedBadge size={14} />}
              {user?._id === post.author._id && (
                <Badge variant="secondary">Author</Badge>
              )}
            </div>
          </Link>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      {post.image.length === 1 ? (
        <img
          className="rounded-sm my-2 w-full aspect-[4/5] object-cover"
          src={post.image}
          alt="post_img"
        />
      ) : (
        <div className=" my-2">
          <Carousel autoSlide={false}>
            {[...post.image.map((s) => <img key={s} src={s} />)]}
          </Carousel>
        </div>
      )}

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24"}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        {bookmarked ? (
          <FaBookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600"
            size={24}
          />
        ) : (
          <LuBookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600"
            size={24}
          />
        )}
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p className="text-sm">
        <Link
          to={`/profile/${post.author?._id}`}
          className="flex items-center gap-1"
        >
          <span className="font-medium">{post.author?.username}</span>
          {post.author.isVerified && <VerifiedBadge size={14} />}
          {post.caption}
        </Link>
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;

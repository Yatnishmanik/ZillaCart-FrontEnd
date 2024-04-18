
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const PostCard = ({
  id,
  title,
  subheader,
  image,
  content,
  comments,
  likes,
  showPosts,
  likesId,
}) => {
  const { userInfo } = useSelector((state) => state.signIn);

  //add like
  // const addLike = async () => {
  //   try {
  //     const { data } = await axios.put(`/api/addlike/post/${id}`);
  //     // console.log("likes", data.post);
  //     // if (data.success == true) {
  //     //     showPosts();
  //     // }
  //   } catch (error) {
  //     console.log(error.response.data.error);
  //     toast.error(error.response.data.error);
  //   }
  // };

  //remove like
  // const removeLike = async () => {
  //   try {
  //     const { data } = await axios.put(`/api/removelike/post/${id}`);
  //     console.log("remove likes", data.post);
  //     if (data.success == true) {
  //         showPosts();
  //     }
  //   } catch (error) {
  //     console.log(error.response.data.error);
  //     toast.error(error.response.data.error);
  //   }
  // };

  return (
    <>
    <div className="bg-gray-200  w-[180px] h-[255px] rounded-lg hover:text-blue-800">
        <Link to={`/post/${id}`} className="flex">
          <img 
            style={{ maxWidth: "180px", height: "150px", width: "100%" }}
            className=" rounded-t-lg"
            src={image}
            alt=""
          />
        </Link>
      <div className="text-center">
        <Link className="font-serif" to={`/post/${id}`}>{title}</Link>
        <div className="text-sm font-thin px-1">{subheader}</div>
      </div>
    </div>
    </>
  );
};

export default PostCard;

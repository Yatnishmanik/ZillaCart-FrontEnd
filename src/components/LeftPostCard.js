
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {URL} from '../config'

const LeftPostCard = ({
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
  //     const { data } = await axios.put(`${URL}/api/addlike/post/${id}`);
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
    <div className="bg-violet-100  w-[140px] h-[175px]  mt-2 border">
        <Link to={`/post/${id}`} className="flex">
          <img 
            style={{ maxWidth: "150px", height: "100px", width: "100%" }}
            className="p-1"
            src={image}
            alt=""
          />
        </Link>
      <div className="text-center" >
        <Link className="font-thin  hover:text-blue-600" to={`/post/${id}`}>{title}</Link>
        {/* <div className="text-sm font-thin px-1">{subheader}</div> */}
      </div>
    </div>
    </>
  );
};

export default LeftPostCard;

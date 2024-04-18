import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

const SidepostCard = ({ id, title, subheader, image, Price, offer, link }) => {
  const { userInfo } = useSelector((state) => state.signIn);

  console.log();
  return (
    <>
      <div className="bg-blue-100  w-[356px] h-[120px] rounded-sm flex ">
        <Link to={`/post/${id}`} className="">
          <img
            className=" rounded-t-lg w-[180px] h-[120px] p-2"
            src={image}
            alt=""
          />
        </Link>
        <div className="text-start">
          <Link className="font-serif  px-1 pt-2 text-gray-800 hover:text-red-800" to={link} target="_blank">{title}</Link>
          <div className=" flex  space-x-10">
            <div className="">
              <CurrencyRupeeIcon />
              {Price}
            </div>
            <div className="text-green-600 font-serif">{offer}</div>
          </div>
          <div className="flex justify-around">
            <div className="text-sm font-thin px-1">{subheader}</div>
            <div className="bg-yellow-400 text-center  text-white p-1 hover:bg-yellow-500">
              <a href={link} target="_blank">
                <LocalGroceryStoreIcon />
                Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidepostCard;

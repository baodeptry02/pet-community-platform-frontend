/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatVND } from "@/utils/formatVND";
import { useSelector } from "react-redux";
import VerifiedBadge from "./VerifiedBadge";

const TopDonate = ({ topDonate }) => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm mb-5">
        <h1 className="font-bold text-gray-600">Top ủng hộ</h1>
      </div>
      {topDonate.map((donate, index) => {
        return (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-md ${
              user?._id === donate.user?._id ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${donate.user?._id}`}>
                <Avatar
                  className={`w-10 h-101 ${
                    user?._id === donate.user?._id ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ border: "1px solid #e0e0e0" }}
                >
                  <AvatarImage
                    src={donate.user?.profilePicture}
                    alt="post_image"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm flex items-center gap-2">
                  <Link
                    to={`/profile/${donate.user?._id}`}
                    className={`
                                                ${
                                                  index === 0 &&
                                                  "username--style1"
                                                } 
                                                ${
                                                  index === 1 &&
                                                  "username--style2"
                                                } 
                                                ${
                                                  index === 2 &&
                                                  "username--style3"
                                                }
                                            `}
                  >
                    {donate.user?.username}
                  </Link>
                  {donate.user?.isVerified && <VerifiedBadge size={14} />}
                </h1>
                <span className="text-gray-600 text-sm">
                  {formatVND(donate?.totalAmount)}
                </span>
              </div>
            </div>
            {
              user?._id !== donate.user?._id && (
                <Link to={`/profile/${donate.user?._id}`}>
                  <span className="text-emerald-500 text-xs font-bold cursor-pointer hover:text-emerald-600">
                    Xem hồ sơ
                  </span>
                </Link>
              )
            }
          </div>
        );
      })}
    </div>
  );
};

export default TopDonate;

import { Button } from "./ui/button";
import { axiosInstance } from "@/lib/axios";
import { CalendarDays, MapPin } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const ActivityCard = (props) => {
  const {
    id,
    name_event,
    start_event,
    end_event,
    location_event,
    event_type,
    imageUrl,
  } = props;

  const loadActivity = async () => {
    try {
      await axiosInstance.get("api/events/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <div className="flex-1 rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Image Section */}
      <img
        src={imageUrl}
        alt="Activity Image"
        className="w-full h-40 object-cover"
      />

      {/* Details Section */}
      <div className="p-4">
        {/* Categories */}
        <div className="flex gap-2 mb-2">
          <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
            {event_type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">{name_event}</h3>

        <div className="flex flex-col mb-4 gap-2">
          <div className="flex gap-2 text-[10px] items-center ">
            <CalendarDays className="w-5 h-5" />
            <p className=" text-gray-600 ">{formatDate(start_event)}</p>
            <span className="text-muted-foreground font-">-</span>
            <p className=" text-gray-600 ">{formatDate(end_event)}</p>
          </div>

          {/* Location */}
          <div className="flex gap-2 text-[10px]">
            <MapPin className="w-5 h-5 items-start flex" />
            <p className=" text-gray-600  items-center">{location_event}</p>
          </div>
        </div>
        {/* Date Range */}

        {/* Button */}
        <Link to={"/detail-activity/" + id}>
          <Button className="w-full bg-[#D1F2EB] text-primary hover:bg-[#D1F2EB] hover:opacity-60">
            Lihat Lebih Lengkap
          </Button>
        </Link>
      </div>
    </div>
  );
};

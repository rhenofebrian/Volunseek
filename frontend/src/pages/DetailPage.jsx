import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DetailContent } from "@/components/DetailContent";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { User } from "lucide-react";

export const DetailPage = () => {
  const params = useParams();
  const profileSelector = useSelector((state) => state.profile);
  // const userSelector = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [detail, setDetail] = useState({
    id: 0,
    name_event: "",
    start_event: "",
    end_event: "",
    location_event: "",
    event_type: "",
    imageURL: "",
    desc: "",
    max_participants: "",
  });

  const [participants, setParticipants] = useState([]); // State untuk menyimpan data peserta

  // Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    const date = new Date(dateString);
    if (isNaN(date)) return "Tanggal tidak valid";
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // Fetch Detail Event
  const fetchActivity = async (eventId) => {
    try {
      const res = await axiosInstance.get(`/api/event/${eventId}/`);
      const data = res.data;
      const image = data.imageURL.length > 0 ? data.imageURL[0].image : "";
      setDetail({ ...data, imageURL: image });
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch Peserta
  const fetchParticipants = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/event/${params.eventId}/enrollment/`
      );
      const participantData = res.data.map(
        (enrollment) => enrollment.participant
      );

      setParticipants(participantData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();

    const volunteerData = {
      user: profileSelector.user,
    };

    try {
      const response = await axiosInstance.post(
        `/api/event/${params.eventId}/enrollment/`,
        volunteerData
      );

      dispatch({
        type: "USER_ENROLLMENT",
        payload: {
          id: response.data.id,
          user: response.data.user,
          address: response.data.address,
          birth_date: response.data.birth_date,
        },
      });

      alert("Pendaftaran berhasil!");
      fetchParticipants();
      console.log(participants);
    } catch (err) {
      console.log(err);
      alert("Pendaftaran gagal");
    }
  };

  useEffect(() => {
    fetchActivity(params.eventId);
    fetchParticipants();
  }, [params.eventId]);

  return (
    <main className="min-h-screen p-10 mt-8 bg-[#D1F2EB]">
      <Card className="flex w-full">
        <div className="flex flex-col sm:flex-row px-8 py-8 w-full gap-8">
          <div className="flex-shrink-0 sm:w-1/3">
            <img
              src={detail.imageURL}
              alt={detail.name_event}
              className="object-cover w-full h-[300px] rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <CardTitle className="mb-4">{detail.name_event}</CardTitle>
            <p className="text-muted-foreground">
              Jenis Kegiatan: {detail.event_type}
            </p>
            <p className="text-muted-foreground">
              Lokasi: {detail.location_event}
            </p>
            <p className="text-muted-foreground">
              Jadwal Kegiatan: {formatDate(detail.start_event)} -{" "}
              {formatDate(detail.end_event)}
            </p>
            <p>{detail.desc}</p>

            <div className="flex flex-col mt-2">
              <Button
                disabled={participants.length >= detail.max_participants}
                onClick={handleEnroll}
                className="bg-[#1ABC9C] text-white hover:bg-[#1ABC9C] hover:opacity-60 w-1/2"
              >
                {participants.length >= detail.max_participants
                  ? "Relawan Sudah Penuh"
                  : "Jadi Relawan"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row mt-8 gap-4">
        <Card className="w-full sm:w-7/12 p-10 ">
          <CardTitle className="pb-8">Detail Aktivitas</CardTitle>
          <DetailContent />
        </Card>

        <Card className="w-full sm:w-5/12 p-10">
          <CardTitle className="pb-8">Relawan</CardTitle>
          {participants.length > 0 ? (
            <ul>
              {participants.map((participant) => (
                <li key={participant.id} className=" mb-4">
                  <div className="flex gap-2 items-center text-xl font-bold">
                    <User />
                    {participant.user}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada peserta yang terdaftar.</p>
          )}
        </Card>
      </div>
    </main>
  );
};

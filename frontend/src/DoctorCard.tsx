import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SERVER = 'http://localhost:5000';

export function DoctorCard({doctor}: {doctor: any}) {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const profilePic = doctor.profile_picture ?? doctor.PROFILE_PICTURE;
    const hasImg = profilePic && !imgError;
    const url = profilePic;
    const imgSrc = hasImg ? (url.startsWith('http') ? url : SERVER + url) : null;

    return (
        <div className="card" onClick={() => navigate(`/doctors/${doctor.id ?? doctor.ID}`)}>
            {imgSrc ? (
              <img src={imgSrc} alt="" className="card-img" onError={() => setImgError(true)} />
               ) : (
              <div className="card-img card-img-placeholder">No Photo</div>
            )}
            <div className="card-body">
                <h3>{doctor.NAME}</h3>
                {doctor.speciality_name && <p className="card-meta">{doctor.speciality_name}</p>}
                {doctor.city_name && <p className="card-meta">{doctor.city_name}</p>}
                {doctor.YOE!=null && <p className="card-meta">{doctor.YOE} Years of Experience Overall </p>}
                {doctor.CONSULTATION_FEE && <p className="card-meta">₹{doctor.CONSULTATION_FEE} Consultation fee at clinic</p>}
                {/* {doctor.degree_name && <p className="card-meta">{doctor.degree_name}</p>} */}
            </div>
        </div>
    )
}
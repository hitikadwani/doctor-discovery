import { useNavigate } from "react-router-dom";

export function DoctorCard({doctor}: {doctor: any}) {
    const navigate = useNavigate();

    return (
        <div className="card" onClick={() => navigate(`/doctors/${doctor.id}`)}>
            {doctor.profile_picture ? ( <img src={doctor.profile_picture} className="card-img"></img>) : (<div className="card-img card-img-placeholder"> No Photo </div>)}
            <div className="card-body">
                <h3> {doctor.name}</h3>
                <p>{doctor.speciality_name}</p>
                <p>{doctor.city_name}</p>
                {doctor.consulation_fee != null && <p>₹{doctor.consulation_fee}</p>}
            </div>
        </div>
    )
}
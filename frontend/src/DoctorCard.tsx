import { useNavigate } from "react-router-dom";

export function DoctorCard({doctor}: {doctor: any}) {
    const navigate = useNavigate();

    return (
        <div className="card" onClick={() => navigate(`/doctors/${doctor.id ?? doctor.ID}`)}>
            {doctor.profile_picture ? ( <img src={doctor.profile_picture} className="card-img"></img>) : (<div className="card-img card-img-placeholder"> No Photo </div>)}
            <div className="card-body">
                <h3> {doctor.name}</h3>
                {doctor.speciality_name && <p className="card-meta">{doctor.speciality_name}</p>}
                {doctor.city_name && <p className="card-meta">{doctor.city_name}</p>}
                {doctor.YOE!=null && <p className="card-meta">{doctor.YOE}</p>}
                {doctor.consultation_fee && <p className="card-meta">{doctor.consultation_fee}</p>}
                {doctor.degree_name && <p className="card-meta">{doctor.degree_name}</p>}
            </div>
        </div>
    )
}
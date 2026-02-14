import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { getDoctorById } from "./store";


export function DoctorDetail() {
    const { id } = useParams<{id: string}>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const doctor = useSelector((state: any) => state.doctorDetail);

    useEffect(() => {
        if(id) dispatch(getDoctorById(id) as any);
    },[dispatch,id]);

    if (!id) return <p>Invalid link.</p>;
    if (doctor?.msg === "Doctor not found") return <p>Doctor not found.</p>;
    if (!doctor) return <p>Loading...</p>;

    const d = doctor;

    const row = (label: string, value: string | number | null | undefined) =>
        value != null && value !== "" ? (
          <p><strong>{label}:</strong> {value}</p>
    ) : null;

    return (
        <div className="page doctor-detail">
            <button type="button" className="btn back-btn" onClick={() => navigate(-1)}>Back</button>
            <div className="detail-card">
                {d.profile_picture ? (<img src={d.profile_picture} alt="" className="detail-img" />) : ( <div className="detail-img detail-img-placeholder">No Photo</div>)}
                <div className="detail-body">
                    <h1>{d.NAME}</h1>
                    {row("Gender",d.gender)}
                    {row("Age", d.AGE)}
                    {row("Email", d.EMAIL)}
                    {row("Phone", d.PHONE)}
                    {row("City", d.city_name)}
                    {row("Institute", d.institute_name ?? d.INSTITUTE_NAME)}
                    {row("Degree", d.degree_name ?? d.DEGREE_NAME)}
                    {row("Speciality", d.speciality_name)}
                    {row("Years of Experience", d.YOE)}
                    {row("Consultation Fee", d.CONSULTATION_FEE != null ? `₹${d.CONSULTATION_FEE}` : null)}
                </div>
            </div>
        </div>
    )
}
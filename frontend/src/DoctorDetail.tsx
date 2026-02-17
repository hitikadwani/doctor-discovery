import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { getDoctorById, getDoctors } from "./store";

const SERVER = "http://localhost:5000";


export function DoctorDetail() {
    const { id } = useParams<{id: string}>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const doctor = useSelector((state: any) => state.doctorDetail);
    const mostSearched = useSelector((state: any) => state.mostSearched);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if(id) dispatch(getDoctorById(id) as any);
        dispatch(getDoctors({ limit: 10, for: 'mostSearched' }) as any);
    },[dispatch,id]);

    if (!id) return <p className="detail-message">Invalid link.</p>;
    if (doctor?.msg === "Doctor not found") return <p className="detail-message">Doctor not found.</p>;
    if (!doctor) return <p className="detail-message">Loading...</p>;
    

    const d = doctor;
    const profilePic = d.profile_picture ?? d.PROFILE_PICTURE;
    const hasImg = profilePic && !imgError;
    const url = profilePic;
    const imgSrc = hasImg ? (url.startsWith('http') ? url : SERVER + url) : null;
    const currentId = d.id ?? d.ID;
    const isTopSearched = Array.isArray(mostSearched) && mostSearched.some((doc: any) => Number(doc.id ?? doc.ID) === Number(currentId));

    const row = (label: string, value: string|number|null|undefined) =>
        value != null && value !== "" ? (
          <p><strong>{label}:</strong> {value}</p>
    ) : null;

    return (
        <div className="page detail-page">
            <button type="button" className="btn back-btn" onClick={() => navigate(-1)}>Back</button>
            <div className="detail-card">
                {imgSrc ? (
                    <img src={imgSrc} alt="" className="detail-img" onError={() => setImgError(true)} />
                ) : (
                    <div className="detail-img detail-img-placeholder">No Photo</div>
                )}
                <div className="detail-body">
                    <div className="detail-name-row">
                        <h1 className="detail-name">{d.NAME}</h1>
                        {isTopSearched && (
                            <span className="detail-badge">Top 10 Most Searched</span>
                        )}
                    </div>
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
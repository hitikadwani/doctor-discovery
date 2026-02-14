import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { getDoctors } from "./store";
import { DoctorCard } from "./DoctorCard";

export function DoctorListing() {
    const [searchParams] = useSearchParams();
    const dispatch= useDispatch();
    const doctors = useSelector((state: any) => state.doctors);
    const loading = useSelector((state: any) => state.loading);

    useEffect(() => {
      const name = searchParams.get('name') || undefined;
      const city = searchParams.get('city') || undefined;
      const speciality =searchParams.get('speciality') || undefined;
      dispatch(getDoctors({ name, city, speciality, limit: 20, for: 'listing'}));
    },[dispatch, searchParams]);



    return (
        <div className="page">
            <h1>Doctors</h1>
            {loading && <p>Loading...</p>}
            <div className="grid">
                {Array.isArray(doctors) && doctors.map((d) => (
                    <DoctorCard key={d.id} doctor={d} />
                ))}
            </div>
            {!loading && Array.isArray(doctors) && doctors.length === 0 && (<p>No Doctors found</p>)}
        </div>
    )
}
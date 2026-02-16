import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors,getCities,getSpecialities } from "./store";
import { DoctorCard } from "./DoctorCard";

const LISTING_LIMIT =8;


export function DoctorListing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch= useDispatch();
    const doctors = useSelector((state: any) => state.doctors);
    const loading = useSelector((state: any) => state.loading);
    const cities =useSelector((state: any) => state.cities);
    const specialities =useSelector((state: any) => state.specialities);
    const hasMore=useSelector((state: any) => state.hasMore);

    const name = searchParams.get("name") || "";
    const city = searchParams.get("city") || "";
    const speciality = searchParams.get("speciality") || "";
    const page = Number(searchParams.get("page") || "1");

    useEffect(() => {
        dispatch(getCities() as any);
        dispatch(getSpecialities() as any);
    }, [dispatch]);
    
    useEffect(() => {
        dispatch(
          getDoctors({
            name: name || undefined,
            city: city || undefined,
            speciality: speciality || undefined,
            page,
            limit: LISTING_LIMIT,
            for: "listing",
          }) as any
        );
    }, [dispatch, name, city, speciality, page]);

    const onSearch = (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newName = (formData.get("name") as string)?.trim() || "";
        const newCity = (formData.get("city") as string) || "";
        const newSpeciality = (formData.get("speciality") as string) || "";
        const params = new URLSearchParams();
        if (newName) params.set("name", newName);
        if (newCity) params.set("city", newCity);
        if (newSpeciality) params.set("speciality", newSpeciality);
        setSearchParams(params);
    };

    const goToPage = (newPage: number) => {
        if (newPage < 1 || (newPage > page && !hasMore)) return;
        const params = new URLSearchParams(searchParams);
        if (newPage <= 1) {
            params.delete("page");
        } else {
            params.set("page", String(newPage));
        }
        setSearchParams(params);
    };
     
    return (
        <div className="page listing-page">
            <h1 className="listing-title">Doctors</h1>
            <section className="listing-header">
                <form onSubmit={onSearch} className="form">
                    <input name="name" placeholder="Search by doctor name" className="input" defaultValue={name} />
                    <select name="city" className="select" defaultValue={city}>
                        <option value="">All Cities</option>
                        {Array.isArray(cities) && cities.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <select name="speciality" className="select" defaultValue={speciality}>
                        <option value="">All Specialities</option>
                        {Array.isArray(specialities) && specialities.map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn">Apply</button>
                </form>
            </section>

            {loading && <p className="listing-loading">Loading...</p>}
            <div className="grid listing-grid">
                {Array.isArray(doctors) && doctors.map((d) => (
                   <DoctorCard key={d.id ?? d.ID} doctor={d} />
                ))}
            </div>
            {!loading && Array.isArray(doctors) && doctors.length === 0 && (
                <p className="listing-empty">No doctors found.</p>
            )}
            {Array.isArray(doctors) && doctors.length > 0 && (
                <div className="listing-pagination">
                    <button type="button" className="btn" onClick={() => goToPage(page - 1)} disabled={page <= 1 || loading}>
                        Previous
                    </button>
                    <span className="listing-page-indicator">Page {page}</span>
                    <button type="button" className="btn" onClick={() => goToPage(page + 1)} disabled={!hasMore || loading}>Next</button>
                </div>
            )}
        </div>
    )
}
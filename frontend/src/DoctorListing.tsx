import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors,getCities,getSpecialities } from "./store";
import { DoctorCard } from "./DoctorCard";

export function DoctorListing() {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch= useDispatch();
    const doctors = useSelector((state: any) => state.doctors);
    const loading = useSelector((state: any) => state.loading);
    const cities =useSelector((state: any) => state.cities);
    const specialities =useSelector((state: any) => state.specialities);

    const name = searchParams.get("name") || "";
    const city = searchParams.get("city") || "";
    const speciality = searchParams.get("speciality") || "";

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
            page: 1,
            limit: 20,
            for: "listing",
          }) as any
        );
    }, [dispatch, name, city, speciality]);

    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const newName = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim() || "";
        const newCity = (form.elements.namedItem("city") as HTMLSelectElement)?.value || "";
        const newSpeciality = (form.elements.namedItem("speciality") as HTMLSelectElement)?.value || "";
        const params = new URLSearchParams();
        if (newName) params.set("name", newName);
        if (newCity) params.set("city", newCity);
        if (newSpeciality) params.set("speciality", newSpeciality);
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
        </div>
    )
}
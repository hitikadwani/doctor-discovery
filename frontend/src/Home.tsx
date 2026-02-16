import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors, getCities,getSpecialities } from "./store";
import { DoctorCard } from "./DoctorCard";

export function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mostSearched = useSelector((state: any) => state.mostSearched);
    const cities = useSelector((state: any) => state.cities);
    const specialities = useSelector((state: any) => state.specialities);

    useEffect(() => {
      dispatch(getDoctors({limit:4, for: 'mostSearched'}) as any);
      dispatch(getCities() as any);
      dispatch(getSpecialities() as any);
    },[dispatch]);


    const onSearch = (e: any) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as any)?.value?.trim() || '';
        const city = (form.elements.namedItem('city') as any)?.value || '';
        const speciality = (form.elements.namedItem('speciality') as any)?.value || '';
        const params = new URLSearchParams();
        if(name) params.set('name', name);
        if(city) params.set('city', city);
        if(speciality) params.set('speciality', speciality);
        navigate(`/doctors?${params.toString()}`); 
    };


    return (
        <div className="page home-page">
            <h1 className="home-title">Find a Doctor</h1>

            <section className="home-section home-most-searched">
                <h2 className="section-title">Most Searched Doctors</h2>
                <div className="doctor-grid">
                    {Array.isArray(mostSearched) && mostSearched.map((d) => (
                        <DoctorCard key={d.id ?? d.ID} doctor={d} />
                    ))}
                </div>
            </section>

            <section className="home-section">
                <h2 className="section-title">Specialities</h2>
                <div className="tags">
                    {Array.isArray(specialities) && specialities.map((s) => (
                        <button key={s.id} type="button" className="tag" onClick={() => navigate(`/doctors?speciality=${encodeURIComponent(s.name)}`)}>
                            {s.name}
                        </button>
                    ))}
                </div>
            </section>


            <section className="home-section">
                <h2 className="section-title">Search & Filter</h2>
                <form onSubmit={onSearch} className="form search-form">
                    <input name ="name" placeholder="Doctor name" className="input" />
                    <select name="city" className="select">
                        <option value="">All Cities</option>
                        {Array.isArray(cities) && cities.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        )
                        )}
                    </select>

                    <select name="speciality" className="select"> 
                        <option value="">All specialities</option>
                        {Array.isArray(specialities) && specialities.map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn">Search</button>
                </form>
            </section>
        </div>
    )
}

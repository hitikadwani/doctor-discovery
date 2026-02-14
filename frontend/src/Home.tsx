import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDoctors } from "./store";
import { DoctorCard } from "./DoctorCard";

export function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const mostSearched = useSelector((state: any) => state.mostSearched);
    const cities = useSelector((state: any) => state.cities);
    const specialities = useSelector((state: any) => state.specialities);

    useEffect(() => {
      dispatch(getDoctors({limit:4, for: mostSearched}));
      dispatch(getCities());
      dispatch(getSpecialities());
    },[dispatch]);


    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
    }
}

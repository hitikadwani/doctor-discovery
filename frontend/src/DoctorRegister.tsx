import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCities, getSpecialities, createDoctor } from "./store";

const emptyForm = {
  name: "",
  gender: "Male",
  age: "",
  email: "",
  phone: "",
  city: "",
  profile_picture: "",
  institute_name: "",
  degree_name: "",
  speciality: "",
  YOE: "",
  consultation_fee: "",
};

export function DoctorRegister() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cities = useSelector((state: any) => state.cities);
  const specialities = useSelector((state: any) => state.specialities);

  useEffect(() => {
    dispatch(getCities() as any);
    dispatch(getSpecialities() as any);
  }, [dispatch]);

  const update = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("profile_picture", reader.result as string);
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    const { name, gender, email, city } = form;
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!city) return "Please select a city.";
    return "";
  };

  const onNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setStep(2);
    setError("");
  };

  const buildPayload = () => {
    return {
      name: form.name.trim(),
      gender: form.gender,
      age: form.age ? Number(form.age) : null,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      city: form.city || null,
      profile_picture: form.profile_picture || null,
      institute_name: form.institute_name.trim() || null,
      degree_name: form.degree_name.trim() || null,
      speciality: form.speciality || null,
      YOE: form.YOE ? Number(form.YOE) : null,
      consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : null,
    };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = buildPayload();
    if (!payload.speciality) {
      setError("Please select a speciality.");
      return;
    }
    try {
      await dispatch(createDoctor(payload) as any).unwrap();
      navigate("/doctors");
    } catch (err: any) {
      setError(err.message || "Failed to register doctor.");
    }
  };

  return (
    <div className="page register-page">
      <h1 className="register-title">Doctor Registration</h1>
      <p className="step-info">Step {step} of 2</p>
      {error && <p className="form-error">{error}</p>}

      {step === 1 && (
        <form className="register-form" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
          <h2 className="form-step-title">Personal Information</h2>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="input"
            required
          />
          <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className="select">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="number"
            placeholder="Age"
            min={0}
            value={form.age}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || Number(v) >= 0) update("age", v);
            }}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="input"
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input"
          />
          <select value={form.city} onChange={(e) => update("city", e.target.value)} className="select" required>
            <option value="">Select City</option>
            {Array.isArray(cities) && cities.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <div className="form-field">
            <label className="form-label">Profile picture</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="input" />
            {form.profile_picture && <p className="small">Image selected.</p>}
          </div>
          <button type="submit" className="btn">Next</button>
        </form>
      )}

      {step === 2 && (
        <form className="register-form" onSubmit={onSubmit}>
          <h2 className="form-step-title">Professional Details</h2>
          <input
            placeholder="Institute name"
            value={form.institute_name}
            onChange={(e) => update("institute_name", e.target.value)}
            className="input"
          />
          <input
            placeholder="Degree name"
            value={form.degree_name}
            onChange={(e) => update("degree_name", e.target.value)}
            className="input"
          />
          <select value={form.speciality} onChange={(e) => update("speciality", e.target.value)} className="select" required>
            <option value="">Select Speciality</option>
            {Array.isArray(specialities) && specialities.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Years of Experience (YOE)"
            value={form.YOE}
            onChange={(e) => update("YOE", e.target.value)}
            className="input"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Consultation Fee"
            value={form.consultation_fee}
            onChange={(e) => update("consultation_fee", e.target.value)}
            className="input"
          />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setStep(1)}>Back</button>
            <button type="submit" className="btn">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
}